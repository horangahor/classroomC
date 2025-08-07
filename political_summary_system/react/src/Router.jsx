import { createBrowserRouter } from "react-router-dom";
import MemberInfo from "../page/MemberInfo";

const router = createBrowserRouter([
    {
        path: "/member_info/:id",
        element: <MemberInfo />,
    },
]);

export default router;