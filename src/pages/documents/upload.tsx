import React from "react";
import withAuth from "@/components/withAuth";
import Header from "@/components/Header";
import DashboardLayout from "@/components/DashboardLayout";
import UploadComponent from "@/components/UploadComponent";
function UploadDocumentPage() {
    return (
        <div className="flex h-screen">
            <DashboardLayout />

            <div className="flex-1 flex flex-col bg-zinc-100">
                <Header />
                <UploadComponent />
            </div>
        </div>
    );

};

export default withAuth(UploadDocumentPage); 