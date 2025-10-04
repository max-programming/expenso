CREATE TYPE "public"."approval_action" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."approval_rule_type" AS ENUM('sequential', 'percentage', 'specific_approver', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."expense_status" AS ENUM('draft', 'pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "approval_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"specific_category_id" text,
	"rule_type" "approval_rule_type" NOT NULL,
	"is_manager_first" boolean DEFAULT true NOT NULL,
	"amount" numeric,
	"approval_percentage" integer,
	"specific_approver_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "approval_steps" (
	"id" text PRIMARY KEY NOT NULL,
	"approval_rule_id" text NOT NULL,
	"approver_id" text NOT NULL,
	"step_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "approval_steps_approval_rule_id_step_order_unique" UNIQUE("approval_rule_id","step_order")
);
--> statement-breakpoint
CREATE TABLE "expense_approvals" (
	"id" text PRIMARY KEY NOT NULL,
	"expense_id" text NOT NULL,
	"approval_rule_id" text,
	"approver_id" text NOT NULL,
	"step_order" integer,
	"action" "approval_action" DEFAULT 'pending' NOT NULL,
	"comments" text,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"action_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "expense_categories_company_id_name_unique" UNIQUE("company_id","name")
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"employee_id" text NOT NULL,
	"category_id" text,
	"amount" numeric NOT NULL,
	"currency_code" varchar(3) NOT NULL,
	"description" text NOT NULL,
	"expense_date" date NOT NULL,
	"paid_by" text,
	"status" "expense_status" DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "approval_rules" ADD CONSTRAINT "approval_rules_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_rules" ADD CONSTRAINT "approval_rules_specific_category_id_expense_categories_id_fk" FOREIGN KEY ("specific_category_id") REFERENCES "public"."expense_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_rules" ADD CONSTRAINT "approval_rules_specific_approver_id_users_id_fk" FOREIGN KEY ("specific_approver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_steps" ADD CONSTRAINT "approval_steps_approval_rule_id_approval_rules_id_fk" FOREIGN KEY ("approval_rule_id") REFERENCES "public"."approval_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_steps" ADD CONSTRAINT "approval_steps_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_approvals" ADD CONSTRAINT "expense_approvals_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_approvals" ADD CONSTRAINT "expense_approvals_approval_rule_id_approval_rules_id_fk" FOREIGN KEY ("approval_rule_id") REFERENCES "public"."approval_rules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_approvals" ADD CONSTRAINT "expense_approvals_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_expense_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."expense_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_paid_by_users_id_fk" FOREIGN KEY ("paid_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;