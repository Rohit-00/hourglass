type Tasks = {   
    id:number;
    date:string;
    percentage:number;
    title: string;  
    duration: number;
    tag:string;
    start_time:string;
    end_time:string;
}
type Result = {
    id: number;
    date: string;
    result: string;
}
type TableProps = {
    heading : string;
    list : Tasks[];
}