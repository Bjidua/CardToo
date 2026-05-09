"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
  size?: number;
}

export const Icons = {
  Home: ({ active, size = 24, className, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-all duration-300", className)}
      {...props}
    >
      {active ? (
        <path
          d="M240-120q-50 0-85-35t-35-85v-240q0-24 9-46t26-39l240-240q17-18 39.5-26.5T480-840q23 0 45 8.5t40 26.5l30 30-315 315v180h400v-180L536-604l115-114 154 153q17 17 26 39t9 46v240q0 50-35 85t-85 35H240Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M480-427ZM240-120q-50 0-85-35t-35-85v-240q0-24 9-46t26-39l240-240q17-18 39.5-26.5T480-840q23 0 45 8.5t40 26.5l240 240q17 17 26 39t9 46v240q0 50-35 85t-85 35H240Zm0-80h480q17 0 28.5-11.5T760-240v-240q0-8-3-15t-9-13L595-662l-59 58 144 144v180H280v-180l258-258-30-30q-8-8-15.5-10t-12.5-2q-5 0-12.5 2T452-748L212-508q-6 6-9 13t-3 15v240q0 17 11.5 28.5T240-200Zm120-160h240v-67L480-547 360-427v67Z"
          fill="currentColor"
        />
      )}
    </svg>
  ),

  Message: ({ active, size = 24, className, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-all duration-300", className)}
      {...props}
    >
      {active ? (
        <path
          d="m240-240-92 92q-19 19-43.5 8.5T80-177v-623q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="m240-240-92 92q-19 19-43.5 8.5T80-177v-623q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240Zm-34-80h594v-480H160v525l46-45Zm-46 0v-480 480Z"
          fill="currentColor"
        />
      )}
    </svg>
  ),

  Collection: ({ active, size = 24, className, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-all duration-300", className)}
      {...props}
    >
      {active ? (
        <path
          d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm280-261 77 46q11 7 21.5-.5T586-356l-20-87 68-59q10-9 6-21.5T622-537l-89-7-35-83q-5-12-18-12t-18 12l-35 83-89 7q-14 1-18 13.5t6 21.5l68 59-20 87q-3 13 7.5 20.5t21.5.5l77-46Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Zm280 379 76 46q11 7 22-.5t8-20.5l-20-87 68-59q10-9 6-21.5T622-537l-89-7-35-82q-5-12-18-12t-18 12l-35 82-89 7q-14 1-18 13.5t6 21.5l68 59-20 87q-3 13 8 20.5t22 .5l76-46Z"
          fill="currentColor"
        />
      )}
    </svg>
  ),

  Profile: ({ active, size = 24, className, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-all duration-300", className)}
      {...props}
    >
      {active ? (
        <path
          d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"
          fill="currentColor"
        />
      )}
    </svg>
  ),

  Search: ({ size = 24, className, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-all duration-300", className)}
      {...props}
    >
      <path
        d="M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
        fill="currentColor"
      />
    </svg>
  ),

  Notification: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M200-200q-17 0-28.5-11.5T160-240q0-17 11.5-28.5T200-280h40v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h40q17 0 28.5 11.5T800-240q0 17-11.5 28.5T760-200H200Zm280-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" fill="currentColor"/>
    </svg>
  ),

  Cart: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M200-640v440h560v-440H640v255q0 23-19 34.5t-39 1.5l-102-51-102 51q-20 10-39-1.5T320-385v-255H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm184 80v190l80-40 80 40v-190H400Zm-200 0h560-560Z" fill="currentColor"/>
    </svg>
  ),

  Plus: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" fill="currentColor"/>
    </svg>
  ),

  Delivery: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M195-195q-35-35-35-85h-51q-17 0-28.5-11.5T69-320q0-17 11.5-28.5T109-360h82q17-19 40-29.5t49-10.5q26 0 49 10.5t40 29.5h167l84-360H230q-17 0-28.5-11.5T190-760q0-17 11.5-28.5T230-800h440q20 0 32 15t7 34l-26 111h77q19 0 36 8.5t28 23.5l75 99q11 14 14 30.5t0 33.5l-27 133q-3 14-14 23t-25 9h-47q0 50-35 85t-85 35q-50 0-85-35t-35-85H400q0 50-35 85t-85 35q-50 0-85-35Zm442-245h193l4-21-74-99h-95l-28 120Zm-99 73 6.5-29q6.5-29 16.5-71 3-13 6-24t5-22l6.5-29q6.5-29 16.5-71t16.5-71l6.5-29 2-7-84 360 2-7ZM70-427q-17 0-28.5-11.5T30-467q0-17 11.5-28.5T70-507h140q17 0 28.5 11.5T250-467q0 17-11.5 28.5T210-427H70Zm80-146q-17 0-28.5-11.5T110-613q0-17 11.5-28.5T150-653h180q17 0 28.5 11.5T370-613q0 17-11.5 28.5T330-573H150Zm130 333q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm400 0q17 0 28.5-11.5T720-280q0-17-11.5-28.5T680-320q-17 0-28.5 11.5T640-280q0 17 11.5 28.5T680-240Z" fill="currentColor"/>
    </svg>
  ),

  Wallet: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z" fill="currentColor"/>
    </svg>
  ),

  Dikemas: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-80 92L160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5-29t10.5-40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 45 238 136Zm-160 93 78-45-237-137-78 45 237 137Z" fill="currentColor"/>
    </svg>
  ),

  Review: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="m480-381 76 46q11 7 22-.5t8-20.5l-20-87 68-59q10-9 6-21.5T622-537l-89-7-35-82q-5-12-18-12t-18 12l-35 82-89 7q-14 1-18 13.5t6 21.5l68 59-20 87q-3 13 8 20.5t22 .5l76-46ZM346-160H240q-33 0-56.5-23.5T160-240v-106l-77-78q-11-12-17-26.5T60-480q0-15 6-29.5T83-536l77-78v-106q0-33 23.5-56.5T240-800h106l78-77q12-11 26.5-17t29.5-6q15 0 29.5 6t26.5 17l78 77h106q33 0 56.5 23.5T800-720v106l77 78q11 12 17 26.5t6 29.5q0 15-6 29.5T877-424l-77 78v106q0 33-23.5 56.5T720-160H614l-78 77q-12 11-26.5 17T480-60q-15 0-29.5-6T424-83l-78-77Zm34-80 100 100 100-100h140v-140l100-100-100-100v-140H580L480-820 380-720H240v140L140-480l100 100v140h140Zm100-240Z" fill="currentColor"/>
    </svg>
  ),

  History: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M520-496v-144q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v159q0 8 3 15.5t9 13.5l132 132q11 11 28 11t28-11q11-11 11-28t-11-28L520-496ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" fill="currentColor"/>
    </svg>
  ),

  Store: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M201-120q-33 0-56.5-23.5T121-200v-318q-23-21-35.5-54t-.5-72l42-136q8-26 28.5-43t47.5-17h556q27 0 47 16.5t29 43.5l42 136q12 39-.5 71T841-518v318q0 33-23.5 56.5T761-120H201Zm368-440q27 0 41-18.5t11-41.5l-22-140h-78v148q0 21 14 36.5t34 15.5Zm-180 0q23 0 37.5-15.5T441-612v-148h-78l-22 140q-4 24 10.5 42t37.5 18Zm-178 0q18 0 31.5-13t16.5-33l22-154h-78l-40 134q-6 20 6.5 43t41.5 23Zm540 0q29 0 42-23t6-43l-42-134h-76l22 154q3 20 16.5 33t31.5 13Z" fill="currentColor"/>
    </svg>
  ),

  Settings: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M433-80q-27 0-46.5-18T363-142l-9-66q-13-5-24.5-12T307-235l-62 26q-25 11-50 2t-39-32l-47-82q-14-23-8-49t27-43l53-40q-1-7-1-13.5v-27q0-6.5 1-13.5l-53-40q-21-17-27-43t8-49l47-82q14-23 39-32t50 2l62 26q11-8 23-15t24-12l9-66q4-26 23.5-44t46.5-18h94q27 0 46.5 18t23.5 44l9 66q13 5 24.5 12t22.5 15l62-26q25-11 50-2t39 32l47 82q14 23 8 49t-27 43l-53 40q1 7 1 13.5v27q0 6.5-2 13.5l53 40q21 17 27 43t-8 49l-48 82q-14 23-39 32t-50-2l-60-26q-11 8-23 15t-24 12l-9 66q-4 26-23.5 44T527-80h-94Zm49-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z" fill="currentColor"/>
    </svg>
  ),

  Favorite: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M228-85q-33 5-59.5-15.5T138-154L85-591q-4-33 16-59t53-30l46-6v326q0 66 47 113t113 47h372q-6 24-24 41.5T664-138L228-85Zm132-195q-33 0-56.5-23.5T280-360v-440q0-33 23.5-56.5T360-880h440q33 0 56.5 23.5T880-800v440q0 33-23.5 56.5T800-280H360Zm149-192 71-43 71 43q6 4 11.5 0t3.5-11l-19-81 62-54q5-5 3.5-10.5T704-635l-82-7-33-76q-2-6-9-6t-9 6l-33 76-82 7q-7 1-8.5 6.5T451-618l62 54-19 81q-2 7 3.5 11t11.5 0Z" fill="currentColor"/>
    </svg>
  ),

  ChevronRight: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" fill="currentColor"/>
    </svg>
  ),

  Filter: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  File: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.5 17.5L17 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Logout: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" fill="currentColor"/>
    </svg>
  ),
  Lock: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M240-80q-33 0-56.5-23.5T160-200v-400q0-33 23.5-56.5T240-680h40v-80q0-83 58.5-141.5T480-960q83 0 141.5 58.5T680-760v80h40q33 0 56.5 23.5T800-600v400q0 33-23.5 56.5T760-80H240Zm0-80h520v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-680h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" fill="currentColor"/>
    </svg>
  ),
  MapPin: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 400Q306-224 223-346.5T140-572q0-156 102.5-252T480-920q135 0 237.5 96T820-572q0 150-83 272.5T480-80Zm0-131q115-104 177.5-206.5T720-572q0-109-72-178.5T480-820q-108 0-180 69.5T228-572q0 82 62.5 184.5T480-211Zm0-349Z" fill="currentColor"/>
    </svg>
  ),
  CreditCard: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M80-200v-560q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160q-33 0-56.5-23.5T80-200Zm80-80h640v-240H160v240Zm0-320h640v-160H160v160Zm0 320v-160 160Z" fill="currentColor"/>
    </svg>
  ),
  Help: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80q0-32 6.5-52.5T543-542q30-31 43.5-56.5T600-653q0-50-35-83.5T480-770q-44 0-77 26.5T356-673l74 30q7-26 23.5-41.5T492-700q26 0 42 15.5t16 39.5q0 19-10.5 35T512-578q-33 32-42.5 57T440-440Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227-93t-93 227q0 134 93 227t227 93Zm0-320Z" fill="currentColor"/>
    </svg>
  ),
  Info: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" className={className} {...props}>
      <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227-93t-93 227q0 134 93 227t227 93Zm0-320Z" fill="currentColor"/>
    </svg>
  ),
  X: ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};