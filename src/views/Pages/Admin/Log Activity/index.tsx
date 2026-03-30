import { Breadcrumb } from "@/views/Components/breadcrumb";

const ActivityLogs = () => {
    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                title="Log Aktivitas"
                desc="Berisi Log Aktivitas user" 
            />
        </div>
    );
}

export default ActivityLogs;