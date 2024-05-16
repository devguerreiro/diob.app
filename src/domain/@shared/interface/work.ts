export interface WorkInterface {
    id: string;
    name: string;
    jobs: Array<WorkJobInterface>;
}

export interface WorkJobInterface {
    id: string;
    name: string;
}
