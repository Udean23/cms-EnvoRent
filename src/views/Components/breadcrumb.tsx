import { ReactNode } from "react"

type ComponentPropType = {
  title: string
  desc: string
  button?: ReactNode
}

export const Breadcrumb = ({ title, desc, button }: ComponentPropType) => {
  return (
    <div className="bg-gradient-to-r from-[#0050E0] to-purple-600 text-white rounded-xl px-6 py-2 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm mt-1">{desc}</p>
      </div>
      <img src="/public/img/breadcrumb.png" alt="Product" className="w-28" />
    </div>  
  )
}