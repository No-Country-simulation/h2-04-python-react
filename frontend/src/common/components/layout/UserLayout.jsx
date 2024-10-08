import { Outlet } from "react-router-dom"
import BottomNav from "@/common/components/BottomNav"

const UserLayout = () => {
  return (
    <div className="relative">
        <div>
          <Outlet />
        </div>
        <BottomNav />
    </div>
  )
}

export default UserLayout