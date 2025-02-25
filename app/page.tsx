"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, BarChart, Users } from "lucide-react";
import OnBoardPopup from "@/components/OnBoardPopup";

export default function Home() {
  const [isOnBoardOpen, setisOnBoardOpen] = useState(true);
  const router = useRouter();

  const handleResumeChat = () => {
    router.push("/chat");
  };

  return (
    <div className="space-y-6">
      <OnBoardPopup
        isOpen={isOnBoardOpen}
        onClose={() => setisOnBoardOpen(false)}
      />
      <h1 className="text-2xl font-bold text-purple-900">
        Welcome to Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resume Help Card */}
        <button
          onClick={handleResumeChat}
          className="group bg-white p-6 rounded-lg shadow-sm border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
              <FileText size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-purple-800">
              Resume Help
            </h3>
          </div>
          <p className="text-gray-600">
            Get expert AI assistance with your resume. Improve your chances of
            landing your dream job.
          </p>
        </button>

        {/* Analytics Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 hover:border-purple-200 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <BarChart size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-purple-800">Analytics</h3>
          </div>
          <p className="text-gray-600">
            Track your application progress and success metrics.
          </p>
        </div>

        {/* Network Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 hover:border-purple-200 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-purple-800">Network</h3>
          </div>
          <p className="text-gray-600">
            Connect with professionals and expand your opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
