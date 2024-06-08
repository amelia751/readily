
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { signOut, useSession } from "next-auth/react";
// import { cn } from "@/lib/utils";
// import { menuItems } from "@/lib/menuItems";

// export interface SidebarNavItem {
//   title: string;
//   href?: string;
//   description?: string;
//   disabled?: boolean;
//   external?: boolean;
//   items?: SidebarNavItem[];
// }

// export interface DocsSidebarNavProps {
//   items: SidebarNavItem[];
// }

// export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
//   const pathname = usePathname();

//   return items.length ? (
//     <div className="w-full">
//       {items.map((item, index) => (
//         <div key={index} className={cn("pb-8")}>
//           <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
//             {item.category}
//           </h4>
//           {item.items ? (
//             <DocsSidebarNavItems items={item.items} pathname={pathname} />
//           ) : null}
//         </div>
//       ))}
//     </div>
//   ) : null;
// }

// interface DocsSidebarNavItemsProps {
//   items: SidebarNavItem[];
//   pathname: string | null;
// }

// export function DocsSidebarNavItems({
//   items,
//   pathname,
// }: DocsSidebarNavItemsProps) {
//   return items?.length ? (
//     <div className="grid grid-flow-row auto-rows-max text-sm">
//       {items.map((item, index) =>
//         !item.disabled && item.href ? (
//           <Link
//             key={index}
//             href={item.href}
//             className={cn(
//               "flex w-full items-center rounded-md p-2 hover:underline",
//               {
//                 "bg-muted": pathname === item.href,
//               }
//             )}
//             target={item.external ? "_blank" : ""}
//             rel={item.external ? "noreferrer" : ""}
//           >
//             {item.title}
//           </Link>
//         ) : (
//           <span className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60">
//             {item.title}
//           </span>
//         )
//       )}
//     </div>
//   ) : null;
// }

// const Sidebar: React.FC = () => {
//   const { data: session } = useSession();

//   return (
//     <div className="z-50 h-screen max-w-64 bg-[#181d25] text-white flex flex-col justify-between">
//       <div className="p-4">
//         <h2 className="text-2xl font-bold">My App</h2>
//         <nav className="mt-4">
//           <DocsSidebarNav items={menuItems} />
//         </nav>
//       </div>
//       {session && (
//         <div className="p-4">
//           <button
//             onClick={() => signOut({ callbackUrl: "/" })}
//             className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200"
//           >
//             Log Out
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { menuItems } from "@/lib/menuItems";

export interface SidebarNavItem {
  title: string;
  href?: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  items?: SidebarNavItem[];
}

export interface DocsSidebarNavProps {
  items: SidebarNavItem[];
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname();

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-8")}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
            {item.category}
          </h4>
          {item.items ? (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          ) : null}
        </div>
      ))}
    </div>
  ) : null;
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        !item.disabled && item.href ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex w-full items-center rounded-md p-2 hover:underline",
              {
                "bg-gray-600": pathname === item.href,
              }
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.title}
          </Link>
        ) : (
          <span className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60">
            {item.title}
          </span>
        )
      )}
    </div>
  ) : null;
}

const Sidebar: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    // Return null or a loading indicator to ensure no mismatch during hydration
    return null;
  }

  return (
    <div className="z-50 max-w-64 bg-[#181d25] text-white flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Readily</h2>
        <nav className="mt-4">
          <DocsSidebarNav items={menuItems} />
        </nav>
      </div>
      {session && (
        <div className="p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

