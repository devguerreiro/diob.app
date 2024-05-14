export interface JobInterface {
    id: string;
    name: string;
    services: Array<JobServiceInterface>;
}

export interface JobServiceInterface {
    id: string;
    name: string;
}
