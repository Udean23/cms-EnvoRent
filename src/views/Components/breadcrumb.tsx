import { ReactNode } from "react";

type ComponentPropType = {
  title: string;
  desc: string;
  button?: ReactNode;
};

export const Breadcrumb = ({ title, desc, button }: ComponentPropType) => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm mt-1 text-white/90">{desc}</p>
      </div>
      <div className="flex items-center gap-4">
        {button}
        <img
          src="/public/img/breadcrumb.png"
          alt="Breadcrumb"
          className="w-28 opacity-90"
        />
      </div>
    </div>
  );
};
