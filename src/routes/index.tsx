import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  Receipt,
  Users,
  Shield,
  Workflow,
  Globe,
  Zap,
  CheckCircle,
  ScanLine,
  TrendingUp,
  ArrowRight,
  Building2,
  UserCircle,
  Settings,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: ({ context }) => {
    if (context.session) {
      switch (context.session.user.role) {
        case "admin":
          throw redirect({ to: "/admin/users" });
        case "manager":
          throw redirect({ to: "/manager/approvals" });
          break;
        case "employee":
          break;
        // throw redirect({ to: "/employee" });
      }
    }
  },
});

function App() {
  const features = [
    {
      icon: <Workflow className="w-10 h-10 text-primary" />,
      title: "Multi-Level Approval Workflows",
      description:
        "Define custom approval chains with sequential steps. Route expenses through Manager → Finance → Director with automatic notifications.",
    },
    {
      icon: <ScanLine className="w-10 h-10 text-primary" />,
      title: "Smart OCR Receipt Scanning",
      description:
        "Just snap a photo of your receipt. OCR automatically extracts amount, date, merchant, and expense type.",
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-primary" />,
      title: "Flexible Approval Rules",
      description:
        "Set percentage-based rules (60% approval), specific approvers (CFO auto-approve), or hybrid combinations for ultimate control.",
    },
    {
      icon: <Shield className="w-10 h-10 text-primary" />,
      title: "Role-Based Access Control",
      description:
        "Granular permissions for Admin, Manager, and Employee roles. Each user sees exactly what they need.",
    },
    {
      icon: <Globe className="w-10 h-10 text-primary" />,
      title: "Multi-Currency Support",
      description:
        "Submit expenses in any currency. Managers view everything in company default currency with automatic conversion.",
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-primary" />,
      title: "Real-Time Tracking",
      description:
        "Track expense status from submission to approval. Complete transparency for employees and managers.",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Submit Expenses",
      description:
        "Employees scan receipts or manually enter expense details with amount, category, and date.",
      icon: <Receipt className="w-8 h-8 text-primary" />,
    },
    {
      step: "02",
      title: "Smart Routing",
      description:
        "Expenses automatically route through configured approval chains based on amount and category rules.",
      icon: <Workflow className="w-8 h-8 text-primary" />,
    },
    {
      step: "03",
      title: "Approve & Process",
      description:
        "Managers approve/reject with comments. System tracks everything with complete audit trail.",
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
    },
  ];

  const roles = [
    {
      title: "Admin",
      icon: <Settings className="w-6 h-6 text-chart-1" />,
      permissions: [
        "Create and manage company",
        "Manage all users and roles",
        "Configure approval rules",
        "Override any approval",
        "View all expenses",
      ],
    },
    {
      title: "Manager",
      icon: <UserCircle className="w-6 h-6 text-chart-3" />,
      permissions: [
        "Approve/reject team expenses",
        "View team expense history",
        "Add comments and notes",
        "Escalate as per rules",
        "View converted currency amounts",
      ],
    },
    {
      title: "Employee",
      icon: <Users className="w-6 h-6 text-primary" />,
      permissions: [
        "Submit expense claims",
        "Upload receipt photos",
        "Track approval status",
        "View expense history",
        "Multi-currency submission",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.15),transparent)]"></div>

        <div className="relative max-w-7xl mx-auto h-screen flex flex-col justify-center items-center text-center px-6 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Intelligent Expense Management
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              Smart Expense Management for Modern Teams
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Automate approvals, eliminate manual processes, and gain complete
              transparency over company expenses with OCR receipt scanning and
              flexible approval workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-6 text-lg rounded-xl group"
              >
                <Link to="/sign-up">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg rounded-xl"
              >
                <Link to="/sign-in">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-8 sm:p-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <Clock className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                The Problem with Manual Expense Management
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Companies waste countless hours on manual expense reimbursement
                processes that are error-prone and lack transparency. There's no
                simple way to define approval flows, manage multi-level
                approvals, or support flexible approval rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Streamline Expenses</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to eliminate manual work and bring
            complete transparency to your expense workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
            >
              <CardHeader>
                <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 w-fit group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your expense management process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((item, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="relative p-6 rounded-2xl bg-card backdrop-blur-sm border border-primary/30">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-lg border-4 border-background text-primary-foreground">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {index < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Roles & Permissions */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Built for Your Entire Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Role-based permissions ensure everyone has the right level of access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <Card
              key={index}
              className="hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-muted border border-border">
                    {role.icon}
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {role.permissions.map((permission, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Advanced Features Highlight */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <ScanLine className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">OCR Receipt Scanning</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Simply scan a receipt photo and OCR technology automatically
                extracts:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-foreground">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span>Amount and currency</span>
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <Receipt className="w-5 h-5 text-primary" />
                  <span>Merchant name and location</span>
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Transaction date and time</span>
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span>Expense category and line items</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/5 to-chart-3/10 backdrop-blur-sm border-chart-3/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Workflow className="w-8 h-8 text-chart-3" />
                <CardTitle className="text-2xl">
                  Conditional Approval Flows
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Create sophisticated approval logic that matches your business
                needs:
              </p>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted border border-border">
                  <p className="text-sm font-semibold text-chart-3 mb-1">
                    Percentage Rule
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Auto-approve when 60% of approvers agree
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted border border-border">
                  <p className="text-sm font-semibold text-chart-3 mb-1">
                    Specific Approver
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CFO approval = instant authorization
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted border border-border">
                  <p className="text-sm font-semibold text-chart-3 mb-1">
                    Hybrid Rules
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Combine multiple conditions for complex flows
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-12 sm:p-16 text-center border border-primary">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),rgba(0,0,0,0))]"></div>

          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-primary-foreground">
              Ready to Transform Your Expense Management?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
              Join modern teams who've eliminated manual expense processes and
              gained complete financial transparency.
            </p>

            <Button
              asChild
              size="lg"
              variant="secondary"
              className="px-10 py-6 text-lg rounded-xl shadow-2xl group"
            >
              <Link to="/sign-up">
                Start Managing Expenses Smarter
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Receipt className="w-6 h-6 text-emerald-400" />
            <span className="text-2xl font-bold">Expenso</span>
          </div>
          <p className="text-gray-400 text-sm">
            Intelligent expense management for modern businesses
          </p>
        </div>
      </footer>
    </div>
  );
}
