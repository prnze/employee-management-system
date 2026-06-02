import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DashboardStats } from '@core/models/api.models';
import { AdminDataService } from '@core/services/admin-data.service';

export const dashboardResolver: ResolveFn<DashboardStats> = () => inject(AdminDataService).dashboard();
