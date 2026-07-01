/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * General health check
     * @returns any Service is healthy
     * @throws ApiError
     */
    public static healthControllerGetHealth(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Liveness check
     * @returns any Service is live
     * @throws ApiError
     */
    public static healthControllerGetLiveHealth(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health/live',
        });
    }
    /**
     * Readiness check
     * @returns any Service is ready
     * @throws ApiError
     */
    public static healthControllerGetReadinessHealth(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health/ready',
        });
    }
    /**
     * Compatibility health route
     * @returns any Service is ready and live
     * @throws ApiError
     */
    public static healthControllerGetReadyLiveHealth(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health/ready/live',
        });
    }
}
