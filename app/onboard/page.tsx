import CreateCustomerForm from "./components/CreateCustomerForm"; 
import { Separator } from "@/components/ui/separator";


export default function OnboardCustomerPage() {
  return (
    
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-slate-bg text-slate-text">
      
      {/* Header Section */}
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          New Customer Registration 
        </h1>
        <p className="text-gray-600 mt-1">
          Complete the multi-step form below to register a new customer and initiate the verification flow.
        </p>
        <Separator className="mt-4 bg-gray-300" />
      </header>

   
      <main className="pb-16">
        
        <CreateCustomerForm />
      </main>
      
      
      <footer className="max-w-4xl mx-auto mt-8 text-center text-xs text-gray-400">
        All submissions are subject to automated flagging and manual audit review.
      </footer>
    </div>
  );
}