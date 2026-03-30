import { Breadcrumb } from "@/views/Components/breadcrumb";

const User = () => {
    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                title="Karyawan"
                desc="Manajemen Data Karyawan" 
            />
        </div>
    );
}

export default User;