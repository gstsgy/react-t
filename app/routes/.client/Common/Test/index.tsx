import { useNavigate } from "react-router";
import { Button } from 'antd';

export default function Test() {
    let navigate = useNavigate();
    function goto(){
        navigate("/");
    }

    return (< >
    hello Test
    <br/>
 
    
    </>);
  }