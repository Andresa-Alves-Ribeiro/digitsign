import React from "react";
import withAuth from "@/features/auth/withAuth";
import Header from "@/layouts/Header";
import DashboardLayout from "@/layouts/DashboardLayout";
import UploadComponent from "@/features/upload/UploadComponent";
function UploadDocumentPage() {
    return (
        <div className="flex h-screen">
            <DashboardLayout activePage="upload" />

            <div className="flex-1 flex flex-col bg-zinc-100">
                <Header />
                <UploadComponent />
            </div>
        </div>
    );

};

export default withAuth(UploadDocumentPage); 