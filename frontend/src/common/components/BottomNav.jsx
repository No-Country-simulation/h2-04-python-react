// import { UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`) 
    );
  };

  return (
    <div className="bottom-nav h-[90px] rounded-t-[9px] bg-[#094DB6] text-white flex items-center justify-around py-2">
      <Link to="/players">
        <div className="flex flex-col items-center justify-center space-y-1">
          <svg
            width="35"
            height="29"
            viewBox="0 0 35 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.3321 13.2348C30.2772 13.2348 33.4867 16.3961 33.4867 20.2819C33.4867 24.1678 30.2772 27.3291 26.3321 27.3291C22.3871 27.3291 19.1776 24.1678 19.1776 20.2819C19.1776 16.3961 22.3871 13.2348 26.3321 13.2348ZM26.3321 11.8253C21.5915 11.8253 17.7467 15.6125 17.7467 20.2819C17.7467 24.9514 21.5915 28.7386 26.3321 28.7386C31.0728 28.7386 34.9176 24.9514 34.9176 20.2819C34.9176 15.6125 31.0728 11.8253 26.3321 11.8253ZM27.0476 23.7689V24.5103H26.3321V23.807C25.5909 23.7943 24.8254 23.6209 24.1858 23.2953L24.512 22.1368C25.196 22.3989 26.1061 22.6766 26.8187 22.5173C27.64 22.3341 27.8089 21.5011 26.9002 21.1008C26.2348 20.795 24.1972 20.5342 24.1972 18.8147C24.1972 17.8549 24.9413 16.9937 26.3321 16.8063V16.0536H27.0476V16.771C27.5656 16.7851 28.1465 16.8739 28.7948 17.067L28.5358 18.2284C27.9863 18.0381 27.3796 17.8662 26.7872 17.9014C25.7226 17.962 25.6281 18.8711 26.3722 19.2516C27.5971 19.8182 29.194 20.2383 29.194 21.7506C29.1954 22.9599 28.2324 23.604 27.0476 23.7689ZM15.7276 16.0536H12.023V13.2348H17.4104C16.7178 14.0832 16.1498 15.0304 15.7276 16.0536ZM14.8848 20.2819H12.023V17.4631H15.2626C15.0251 18.3665 14.8848 19.308 14.8848 20.2819ZM18.7869 11.8253H12.023V9.00644H22.0394V9.8366C20.8389 10.3172 19.7442 10.9952 18.7869 11.8253ZM22.0394 3.36868H12.023V0.549805H22.0394V3.36868ZM22.0394 7.597H12.023V4.77812H22.0394V7.597ZM15.7276 24.5103H12.023V21.6914H14.9836C15.1095 22.6752 15.3613 23.6209 15.7276 24.5103ZM0.575684 9.00644H10.5921V11.8253H0.575684V9.00644ZM0.575684 13.2348H10.5921V16.0536H0.575684V13.2348ZM18.7869 28.7386H12.023V25.9197H16.4331C17.0598 26.981 17.8554 27.9324 18.7869 28.7386ZM0.575684 21.6914H10.5921V24.5103H0.575684V21.6914ZM0.575684 25.9197H10.5921V28.7386H0.575684V25.9197ZM0.575684 17.4631H10.5921V20.2819H0.575684V17.4631Z"
              fill="white"
              fillOpacity={isActive("/players") ? "1" : "0.3"}
            />
          </svg>
          <span
            className={`text-sm ${
              isActive("/players") ? "text-white" : "text-white/30"
            }`}
          >
            Scout players
          </span>
        </div>
      </Link>
      <Link to="/matches">
        <div className="flex flex-col items-center justify-center space-y-1">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.9121 0.828613C21.4432 0.828613 27.5479 6.84173 27.5479 14.2597C27.5479 21.6777 21.4432 27.6909 13.9121 27.6909C6.3811 27.6909 0.276367 21.6777 0.276367 14.2597C0.276367 6.84173 6.3811 0.828613 13.9121 0.828613ZM16.1893 19.6322H11.635L9.75323 22.1801L10.5087 24.4714C11.6073 24.8257 12.7561 25.0056 13.9121 25.0046C15.0998 25.0046 16.2439 24.8166 17.3156 24.4714L18.0697 22.1801L16.1893 19.6322ZM4.76799 12.7447L3.00625 14.0045L3.00352 14.2597C3.00352 16.5833 3.75213 18.7336 5.02434 20.4918H7.62878L9.43279 18.0473L8.03103 13.7896L4.76799 12.7447ZM23.0563 12.7447L19.7933 13.7896L18.3915 18.0473L20.1941 20.4918H22.7986C24.1173 18.6736 24.8244 16.4942 24.8208 14.2597L24.8167 14.0045L23.0563 12.7447ZM13.9121 10.9503L10.7159 13.2363L11.9377 16.946H15.8852L17.107 13.2363L13.9121 10.9503ZM17.0361 3.96209L15.2757 5.22462V8.60523L18.9492 11.2337L22.0036 10.2573L22.759 7.96994C21.3523 6.04945 19.3396 4.64049 17.0361 3.96209ZM10.7882 3.96209C8.48503 4.64111 6.4741 6.05053 5.06798 7.97128L5.8234 10.2573L8.87645 11.2337L12.5486 8.60523V5.22462L10.7882 3.96209Z"
              fill={isActive("/matches") ? "#FFFFFF" : "#5886CD"}
            />
          </svg>

          <span
            className={`text-sm ${
              isActive("/matches") ? "text-white" : "text-white/30"
            }`}
          >
            Partidos
          </span>
        </div>
      </Link>
      <Link to="/divisions">
        <div className="flex flex-col items-center justify-center space-y-1">
          <svg
            width="24"
            height="27"
            viewBox="0 0 24 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.8892 0.510254C17.6272 0.510276 18.3392 0.778194 18.8893 1.26279C19.4393 1.74738 19.7887 2.41465 19.8707 3.13702H21.5614C22.1471 3.13705 22.7113 3.35396 23.142 3.7447C23.5728 4.13545 23.8387 4.67145 23.8869 5.24632L23.8949 5.43545V9.3756C23.895 10.4659 23.4715 11.5149 22.7113 12.3074C21.9511 13.0999 20.9118 13.5758 19.8067 13.6375L19.5267 13.6454C19.082 15.0099 18.253 16.2219 17.1362 17.1403C16.0194 18.0588 14.6608 18.6459 13.2184 18.8333V20.8677H15.5558C16.6625 20.868 17.7271 21.2853 18.5314 22.034C19.3357 22.7828 19.8187 23.8062 19.8814 24.8946L19.8894 25.1362V25.7929C19.8893 26.0312 19.8016 26.2613 19.6425 26.4407C19.4834 26.6201 19.2636 26.7367 19.024 26.7688L18.8893 26.778H5.55001C5.30812 26.7783 5.07431 26.6922 4.8919 26.5357C4.7095 26.3792 4.59086 26.1629 4.55796 25.9269L4.54996 25.7929V25.1362C4.54987 24.0462 4.97318 22.9973 5.73309 22.2049C6.49301 21.4124 7.53193 20.9363 8.63682 20.8743L8.8835 20.8677H11.2169V18.8333C9.77505 18.6454 8.41695 18.0581 7.30066 17.1397C6.18438 16.2213 5.35579 15.0095 4.91131 13.6454L4.87797 13.6441C3.72865 13.6441 2.6264 13.1944 1.8137 12.3939C1.001 11.5934 0.544434  10.5077 0.544434 9.3756V5.43545C0.544434 4.16672 1.58982 3.13702 2.87788 3.13702H4.56863C4.65065 2.41442 5.00025 1.74697 5.55056 1.26235C6.10087 0.777726 6.81326 0.509953 7.55144 0.510254H16.8892ZM15.5558 22.8378H8.8835C8.3567 22.8375 7.8453 23.0129 7.43252 23.3353C7.01974 23.6577 6.72987 24.1082 6.61006 24.6135L6.57272 24.8079H17.8639C17.7888 24.2953 17.5401 23.8228 17.1582 23.4669C16.7763 23.111 16.2835 22.8926 15.7598 22.847L15.5558 22.8378ZM16.8892 2.48033H7.5501C7.28487 2.48033 7.03051 2.58411 6.84296 2.76884C6.65542 2.95357 6.55006 3.20412 6.55006 3.46537V11.3444C6.57288 12.8105 7.18019 14.2089 8.24084 15.2377C9.30149 16.2666 10.7304 16.8432 12.219 16.8432C13.7076 16.8432 15.1365 16.2666 16.1972 15.2377C17.2578 14.2089 17.8651 12.8105 17.8879 11.3444V3.46537C17.8879 3.20412 17.7826 2.95357 17.595 2.76884C17.4075 2.58411 17.1544 2.48033 16.8892 2.48033ZM21.5601 5.1071H19.888V11.6517C20.4095 11.5787 20.8906 11.334 21.2531 10.9575C21.6155 10.581 21.8379 10.0947 21.8841 9.57787L21.8935 9.3756V5.43545C21.8933 5.36147 21.8679 5.28971 21.8211 5.23178C21.7744 5.17386 21.7092 5.13316 21.6361 5.1163L21.5601 5.1071ZM4.54996 5.1071H2.87788C2.78947 5.1071 2.70468 5.1417 2.64217 5.20327C2.57965 5.26485 2.54453 5.34837 2.54453 5.43545V9.3756C2.54445 9.92949 2.74745 10.4648 3.11616 10.883C3.48487 11.3012 3.9945 11.5742 4.55129 11.6517L4.54996 5.1071Z"
              fill={isActive("/divisions") ? "#FFFFFF" : "#5886CD"}
            />
          </svg>
          <span
            className={`text-sm ${
              isActive("/divisions") ? "text-white" : "text-white/30"
            }`}
          >
            Divisiones
          </span>
        </div>
      </Link>
      {/* <Link to="/profile">
        <div className="flex flex-col items-center justify-center space-y-1">
          <UserRound
            className={`size-7 ${
              isActive("/profile") ? "opacity-100" : "opacity-30"
            }`}
          />
          <span
            className={`text-sm ${
              isActive("/profile") ? "text-white" : "text-white/30"
            }`}
          >
            Perfil
          </span>
        </div>
      </Link> */}
    </div>
  );
};

export default BottomNav;
