<#
.SYNOPSIS
  Extracts inline template/styles from Angular component .ts files into
  external .html / .scss files and updates the decorator accordingly.

  Run from the project root: pwsh scripts/extract-templates.ps1
#>

$srcRoot = Join-Path $PSScriptRoot '..' 'src\app'
$components = Get-ChildItem -Recurse -Filter '*.component.ts' -Path $srcRoot

$migrated   = @()
$skipped    = @()
$errors     = @()

foreach ($file in $components) {
    $dir       = $file.DirectoryName
    $base      = [IO.Path]::GetFileNameWithoutExtension($file.Name)   # e.g. login.component
    $htmlFile  = Join-Path $dir "$base.html"
    $scssFile  = Join-Path $dir "$base.scss"
    $content   = Get-Content $file.FullName -Raw -Encoding UTF8

    # ── 1. Skip if already using templateUrl ──────────────────────
    if ($content -match 'templateUrl') {
        $skipped += $file.Name
        continue
    }

    # ── 2. Extract template ───────────────────────────────────────
    # Matches:  template: `...` (backtick, multi-line)
    $tplMatch = [regex]::Match($content, '(?s)template:\s*`(.*?)`(?=\s*[,}])', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if (-not $tplMatch.Success) {
        $skipped += "$($file.Name) (no inline template)"
        continue
    }
    $templateBody = $tplMatch.Groups[1].Value

    # ── 3. Extract styles ─────────────────────────────────────────
    # Matches:  styles: [`...`]  or  styles: [`...`, `...`]
    $stylesMatch = [regex]::Match($content, '(?s)styles:\s*\[(.*?)\](?=\s*[,}])', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $scssBody = ''
    if ($stylesMatch.Success) {
        # Pull all backtick-delimited style blocks
        $backtickBlocks = [regex]::Matches($stylesMatch.Groups[1].Value, '(?s)`(.*?)`')
        $scssBody = ($backtickBlocks | ForEach-Object { $_.Groups[1].Value }) -join "`n"
    }

    # ── 4. Write .html ────────────────────────────────────────────
    try {
        [IO.File]::WriteAllText($htmlFile, $templateBody, [System.Text.Encoding]::UTF8)
    } catch {
        $errors += "HTML write failed: $($file.Name) — $_"
        continue
    }

    # ── 5. Write .scss ────────────────────────────────────────────
    try {
        [IO.File]::WriteAllText($scssFile, $scssBody, [System.Text.Encoding]::UTF8)
    } catch {
        $errors += "SCSS write failed: $($file.Name) — $_"
        continue
    }

    # ── 6. Rewrite .ts — replace template block with templateUrl ──
    $relHtml = "./$base.html"
    $relScss = "./$base.scss"

    # Remove template: `...`  →  templateUrl: './x.html'
    $newContent = [regex]::Replace(
        $content,
        '(?s)template:\s*`.*?`(?=\s*[,}])',
        "templateUrl: '$relHtml'",
        [System.Text.RegularExpressions.RegexOptions]::Singleline
    )

    # Remove styles: [...]  →  styleUrl: './x.scss'
    if ($stylesMatch.Success) {
        $newContent = [regex]::Replace(
            $newContent,
            '(?s)styles:\s*\[.*?\](?=\s*[,}])',
            "styleUrl: '$relScss'",
            [System.Text.RegularExpressions.RegexOptions]::Singleline
        )
    } else {
        # No styles block — insert styleUrl after templateUrl line
        $newContent = $newContent -replace "(templateUrl:\s*'[^']+')(\s*,)", "`$1,`n  styleUrl: '$relScss'`$2"
    }

    try {
        [IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
    } catch {
        $errors += "TS write failed: $($file.Name) — $_"
        continue
    }

    $migrated += $file.Name
}

Write-Host ""
Write-Host "=== MIGRATION COMPLETE ==="
Write-Host "Migrated : $($migrated.Count)"
$migrated | ForEach-Object { Write-Host "  OK  $_" }
Write-Host ""
Write-Host "Skipped  : $($skipped.Count)"
$skipped  | ForEach-Object { Write-Host "  --  $_" }
Write-Host ""
if ($errors.Count -gt 0) {
    Write-Host "Errors   : $($errors.Count)"
    $errors | ForEach-Object { Write-Host "  ERR $_" }
} else {
    Write-Host "Errors   : 0"
}
