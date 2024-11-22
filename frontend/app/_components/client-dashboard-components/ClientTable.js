import { sendPostJsonRequest } from "@/app/utils/resHandler";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ClientTable({ project, onDelete }) {
  const { title, status, deadline, id } = project;

  return (
    <table className="min-w-full border border-gray-300">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b">
            Project Name
          </th>
          <th className="px-4 py-2 border-b">Status</th>
          <th className="px-4 py-2 border-b">Deadline</th>
          <th className="px-4 py-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td className="px-4 py-2 border-b">{title}</td>
          <td className="px-4 py-2 border-b">{status}</td>
          <td className="px-4 py-2 border-b">{deadline}</td>
          <td className="px-4 py-2 border-b">
            <Link
              href={`/client-dashboard/edit/${id}`}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Edit
            </Link>

            <AlertDialog>
              <AlertDialogTrigger>
                <button className="px-3 py-1 bg-red-500 text-white rounded">
                  Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-100 text-primary-900">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will
                    permanently delete your account and
                    remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* <button
              onClick={() => onDelete(id)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button> */}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default ClientTable;
