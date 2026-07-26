/** Metadata required to render one external portfolio tool link. */
export interface ToolNavigationItem {
  id: 'ems' | 'sharex' | 'passx' | 'formatx';
  labelKey: string;
  href: string;
  faviconUrl: string;
}

interface ToolDefinition {
  id: ToolNavigationItem['id'];
  labelKey: string;
  path: string;
  faviconPath: string;
}

export const TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  { id: 'ems', labelKey: 'LANDING.NAV.TOOLS.EMS', path: '/ems', faviconPath: '/assets/tool-icons/ems.svg' },
  { id: 'sharex', labelKey: 'LANDING.NAV.TOOLS.SHAREX', path: '/sharex', faviconPath: '/assets/tool-icons/sharex.svg' },
  { id: 'passx', labelKey: 'LANDING.NAV.TOOLS.PASSX', path: '/passx', faviconPath: '/assets/tool-icons/passx.svg' },
  { id: 'formatx', labelKey: 'LANDING.NAV.TOOLS.FORMATX', path: '/formatx', faviconPath: '/assets/tool-icons/formatx.svg' }
];
