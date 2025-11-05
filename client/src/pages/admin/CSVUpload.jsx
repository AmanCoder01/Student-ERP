import React from 'react'

const CSVUpload = ({csvUploading,setCsvUploading}) => {
    
    return (
        <div className="mt-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 rounded-2xl shadow-lg border border-gray-700 dark:bg-gray-800 px-6 py-4 transition hover:shadow-xl">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-full shadow-md">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Bulk Upload Students</h2>
                    <p className="text-gray-600 text-sm dark:text-gray-300">
                        Upload a CSV file to quickly add multiple students at once.
                    </p>
                </div>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center gap-4">
                <label
                    htmlFor="csvFile"
                    className={`cursor-pointer inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium transition 
        ${csvUploading
                            ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'}`}
                >
                    {csvUploading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v16h16V4H4zm4 8l4 4 4-4m-4 4V8"
                                />
                            </svg>
                            Upload CSV
                        </>
                    )}
                    <input
                        id="csvFile"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        disabled={csvUploading}
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (!window.confirm('Upload CSV and create students?')) return;

                            setCsvUploading(true);
                            const form = new FormData();
                            form.append('file', file);

                            const ok = await dispatch(adminService.bulkUploadStudents(form));
                            setCsvUploading(false);

                            if (ok?.success) {
                                dispatch(adminService.fetchStudents());
                                const { createdCount, errors } = ok;
                                let msg = `${createdCount} students created successfully.`;
                                if (errors && errors.length) {
                                    msg += ` ${errors.length} rows had issues. Check console for details.`;
                                    console.table(errors);
                                }
                                toast.success(msg);
                            } else {
                                toast.error('Upload failed. Please check your file and try again.');
                            }
                        }}
                    />
                </label>

                <a
                    href="/student_bulk_upload_template.csv"
                    download
                    className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-400 transition underline"
                >
                    Download CSV Template
                </a>
            </div>
        </div>
    )
}

export default CSVUpload
