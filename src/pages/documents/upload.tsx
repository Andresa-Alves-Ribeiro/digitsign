import React from "react";
import withAuth from "@/features/auth/withAuth";
import UploadComponent from "@/features/upload/UploadComponent";

function UploadDocumentPage() {
    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col bg-zinc-100">
                <UploadComponent />
            </div>
        </div>
    );
}

export default withAuth(UploadDocumentPage); 