type Tasks = {   
    date?:string;
    percentage?:number;
    title: string;  
    duration: number;
    tag?:string;
    start_time?:string;
    end_time?:string;
}

type TableProps = {
    heading : string;
    list : Tasks[];
}