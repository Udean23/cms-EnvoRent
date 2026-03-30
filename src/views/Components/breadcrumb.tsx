import { ReactNode } from "react";

type ComponentPropType = {
  title: string;
  desc: string;
  button?: ReactNode;
};

export const Breadcrumb = ({ title, desc, button }: ComponentPropType) => {
  return (
    <div className=" bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-8 flex items-center justify-between shadow-lg overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <p className="text-sm mt-2 text-emerald-50/90 font-medium max-w-md">{desc}</p>
      </div>
      <div className="relative z-10 flex items-center gap-6">
        {button}
        <div className="hidden sm:block">
          <img
            src="/public/img/breadcrumb.png"
            alt="Breadcrumb"
            className="w-32 drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};
