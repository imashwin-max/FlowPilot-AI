insert into workflow_requests
  (id, title, requester, request_type, department, priority, approver, summary, status, comments, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111', 'Medical leave for fever', 'Ananya Rao', 'Leave Request', 'Human Resources', 'medium', 'Meera Iyer', 'Employee requests one day of medical leave tomorrow due to fever.', 'pending', null, now() - interval '38 minutes', now() - interval '38 minutes'),
  ('22222222-2222-2222-2222-222222222222', 'Laptop replacement approval', 'Vikram Menon', 'Asset Procurement', 'IT', 'high', 'Rohan Shah', 'Developer laptop battery has failed and needs replacement for sprint delivery.', 'approved', 'Approved. IT procurement can issue a replacement today.', now() - interval '5 hours', now() - interval '3 hours'),
  ('33333333-3333-3333-3333-333333333333', 'Vendor invoice exception', 'Sara Khan', 'Finance Approval', 'Finance', 'urgent', 'Arjun Patel', 'Invoice exceeds purchase order by 8% and requires finance exception approval.', 'pending', null, now() - interval '9 hours', now() - interval '9 hours'),
  ('44444444-4444-4444-4444-444444444444', 'Campaign budget extension', 'Neha Gupta', 'Budget Approval', 'Marketing', 'medium', 'Kavya Nair', 'Marketing requests an additional budget allocation for launch campaign creatives.', 'rejected', 'Rejected until revised media plan and ROI estimate are attached.', now() - interval '26 hours', now() - interval '20 hours'),
  ('55555555-5555-5555-5555-555555555555', 'Access to production logs', 'Ishaan Bose', 'Access Request', 'Security', 'high', 'Priya Das', 'Engineer needs temporary production log access for incident diagnosis.', 'approved', 'Approved for 24 hours with audit logging enabled.', now() - interval '48 hours', now() - interval '45 hours')
on conflict (id) do nothing;

insert into activity_logs
  (workflow_id, actor, action, details, created_at)
values
  ('11111111-1111-1111-1111-111111111111', 'FlowPilot AI', 'Workflow created', 'Assigned Human Resources approval to Meera Iyer.', now() - interval '38 minutes'),
  ('22222222-2222-2222-2222-222222222222', 'Rohan Shah', 'Approved request', 'Laptop replacement cleared for procurement.', now() - interval '3 hours'),
  ('44444444-4444-4444-4444-444444444444', 'Kavya Nair', 'Rejected request', 'Budget extension needs stronger ROI estimate.', now() - interval '20 hours'),
  ('55555555-5555-5555-5555-555555555555', 'Priya Das', 'Approved request', 'Temporary access granted with audit controls.', now() - interval '45 hours');
