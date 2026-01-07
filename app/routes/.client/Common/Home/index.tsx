import { useNavigate } from "react-router";
import { Button } from 'antd';

export default function Home() {
    let navigate = useNavigate();
    function goto(){
        navigate("/test");
    }

    return (< >
    hello Home
    <br/>
    
    
    </>);
  }