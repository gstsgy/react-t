import { type RouteConfig, relative ,route ,prefix, layout} from "@react-router/dev/routes";
import { GlobalConfig } from "@/utils/config";
const client = relative("app/routes/.client");
export default [
    ...prefix(GlobalConfig.prefix,[
        client.route("/login", "Login/index.tsx"),
        client.layout('Layout/index.tsx',[
            
            client.index("Common/Home/index.tsx"),
            //client.route("/home","Common/Home/index.tsx"),
            client.route("/test", "Common/Test/index.tsx"),
        ])
    ])
    
   
] satisfies RouteConfig;
