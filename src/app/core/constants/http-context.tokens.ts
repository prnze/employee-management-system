import { HttpContextToken } from '@angular/common/http';

export const REFRESH_ATTEMPTED = new HttpContextToken<boolean>(() => false);
