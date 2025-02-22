type Tasks = {   
    date?:string;
    percentage?:number;
    title: string;  
    duration: string;
    tag?:string;
}

type TableProps = {
    heading : string;
    list : Tasks[];
}