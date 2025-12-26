# Next Session Implementation Plan

## Current Status

### ✅ Completed
- [x] All feature code implemented and committed (82 files, 12,255 insertions)
- [x] All tests passing locally (36 unit tests, 3 integration tests)
- [x] Production build successful
- [x] Zero lint issues
- [x] Code pushed to GitHub repository (commit: fec32a1)
- [x] Test accounts created in production (admin/editor/reviewer/member)
- [x] Environment variables configured in Vercel
- [x] Production test report generated
- [x] Personal information sanitized from codebase

### ⚠️ Blocked - Critical Path
**Production schema is out of sync with repository** - This blocks 81% of planned test coverage

**Problem**: 7 new migrations exist locally but haven't been applied to production database
**Impact**: Major features deployed to code but not functional due to missing tables/columns
**Risk Level**: HIGH

---

## Priority 1: Apply Database Migrations to Production

### Context
The following migrations need to be applied to production Supabase:

1. ✅ `20251219000000_init.sql` - Already applied
2. ✅ `20251219001000_articles.sql` - Already applied
3. ✅ `20251219002000_articles_delete.sql` - Already applied
4. ❌ `20251225000000_expand_profiles.sql` - **NOT APPLIED**
5. ❌ `20251225160000_rbac_system.sql` - **NOT APPLIED**
6. ❌ `20251225170000_storage_buckets.sql` - **NOT APPLIED**
7. ❌ `20251225180000_review_system.sql` - **NOT APPLIED**
8. ❌ `20251225190000_membership_applications.sql` - **NOT APPLIED**
9. ❌ `20251225200000_taxonomy.sql` - **NOT APPLIED**
10. ❌ `20251225210000_collections_issues.sql` - **NOT APPLIED**

### Method Options

#### Option A: Supabase CLI (Recommended)
```bash
# Project is already linked
supabase db execute -f supabase/migrations/20251225000000_expand_profiles.sql
supabase db execute -f supabase/migrations/20251225160000_rbac_system.sql
supabase db execute -f supabase/migrations/20251225170000_storage_buckets.sql
supabase db execute -f supabase/migrations/20251225180000_review_system.sql
supabase db execute -f supabase/migrations/20251225190000_membership_applications.sql
supabase db execute -f supabase/migrations/20251225200000_taxonomy.sql
supabase db execute -f supabase/migrations/20251225210000_collections_issues.sql
```

**Status**: Ready to execute, just needs confirmation

**Why this failed before**: Initial migrations (init, articles) already exist in production, causing policy conflicts. The new migrations (20251225*) should apply cleanly.

#### Option B: Manual via Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/cgjzowzomduqwdxolcon/sql/new
2. Copy each migration file content
3. Execute in SQL editor
4. Repeat for all 7 migrations

**Pros**: Visual confirmation, can see errors
**Cons**: Manual, time-consuming

### Expected Changes
After applying migrations, production will have:

- **Expanded profiles**: title, affiliation, bio, visibility, expertise tags
- **RBAC system**: roles table, role assignments, permission checks
- **Storage buckets**: avatars, article-assets with proper policies
- **Review system**: reviews, submissions, reviewer assignments
- **Membership applications**: achievements, publications, contributions columns
- **Taxonomy**: topics and tags tables with RLS policies
- **Collections/Issues**: collections, issues, junction tables

---

## Priority 2: Trigger Vercel Deployment

### Why Needed
New routes `/collections` and `/issues` currently return 404 because they weren't included in the most recent deployment.

### Method Options

#### Option A: Git Push (Auto-deploy)
```bash
# Already done! Commit fec32a1 includes all new routes
# Vercel should auto-deploy on push to main
# Wait 2-3 minutes, then check deployment status
```

Check status:
```bash
npx vercel inspect professional-website-2026 --scope mushier-rouge
```

#### Option B: Force Redeploy via Vercel CLI
```bash
npx vercel --prod
```

#### Option C: Via Vercel Dashboard
1. Open: https://vercel.com/mushier-rouge/professional-website-2026
2. Click "Deployments" tab
3. Find latest deployment
4. Click three dots → "Redeploy"

### Expected Result
All routes should be accessible:
- ✅ `/collections` → 200
- ✅ `/collections/[slug]` → 200
- ✅ `/issues` → 200
- ✅ `/issues/[slug]` → 200
- ✅ `/admin/collections/*` → 200 (with auth)
- ✅ `/admin/topics/*` → 200 (with auth)

---

## Priority 3: Assign Roles to Test Accounts

### Context
Test accounts exist but have no roles assigned, blocking RBAC testing.

### Required Actions
After migrations are applied (which creates the `roles` table), assign roles:

```sql
-- Connect to production DB via Supabase SQL Editor
-- Get user IDs from auth.users where email like 'codex.e2e.%'

-- Assign admin role
INSERT INTO public.roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'codex.e2e.admin+20251226024924808@example.com';

-- Assign editor role
INSERT INTO public.roles (user_id, role)
SELECT id, 'editor'
FROM auth.users
WHERE email = 'codex.e2e.editor+20251226024924808@example.com';

-- Assign reviewer role
INSERT INTO public.roles (user_id, role)
SELECT id, 'reviewer'
FROM auth.users
WHERE email = 'codex.e2e.reviewer+20251226024924808@example.com';

-- member account gets no additional role (default member)
```

### Alternative Method
Create a script:

```bash
node -e "
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf-8');
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const SERVICE_KEY = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function assignRoles() {
  const roles = [
    { email: 'codex.e2e.admin+20251226024924808@example.com', role: 'admin' },
    { email: 'codex.e2e.editor+20251226024924808@example.com', role: 'editor' },
    { email: 'codex.e2e.reviewer+20251226024924808@example.com', role: 'reviewer' }
  ];

  for (const { email, role } of roles) {
    const { data: user } = await supabase.auth.admin.getUserByEmail(email);
    if (user) {
      await supabase.from('roles').insert({ user_id: user.id, role });
      console.log(\`✅ Assigned \${role} to \${email}\`);
    }
  }
}

assignRoles();
"
```

---

## Priority 4: Comprehensive Production E2E Testing

### Test Accounts
Already created with password `Test!0b7c002658af`:
- `codex.e2e.admin+20251226024924808@example.com`
- `codex.e2e.editor+20251226024924808@example.com`
- `codex.e2e.reviewer+20251226024924808@example.com`
- `codex.e2e.member+20251226024924808@example.com`

### Test Suite Breakdown

#### 4.1 Authentication UI Flows (Member Account)
- [ ] Navigate to /login
- [ ] Login with member credentials
- [ ] Verify redirect to /account
- [ ] Check session persistence (refresh page)
- [ ] Navigate to /profile/edit
- [ ] Update display name
- [ ] Upload avatar image
- [ ] Save changes
- [ ] Verify changes reflected
- [ ] Logout
- [ ] Verify redirect to homepage

#### 4.2 Membership Application Flow (Member Account)
- [ ] Login as member
- [ ] Navigate to /membership/apply
- [ ] Fill out application form:
  - Requested grade: Senior
  - Evidence of achievements
  - Publications list
  - Contributions to field
  - References
- [ ] Submit application
- [ ] Verify success message
- [ ] Navigate to /account/applications
- [ ] Verify application appears with "submitted" status

#### 4.3 Admin Application Review (Admin Account)
- [ ] Login as admin
- [ ] Navigate to /admin/applications
- [ ] Verify member's application appears
- [ ] Click application to view details
- [ ] Review application content
- [ ] Approve application
- [ ] Verify status changes to "approved"
- [ ] Logout and login as member
- [ ] Verify membership grade upgraded
- [ ] Navigate to /account/applications
- [ ] Verify application status shows "approved"

#### 4.4 Article Submission Flow (Member Account)
- [ ] Login as member (now senior after upgrade)
- [ ] Navigate to /articles/new
- [ ] Fill article form:
  - Title: "Test Article on Machine Learning"
  - Abstract: 250-word summary
  - Content: Full markdown article
  - Article type: Research Article
  - Topics: Select 2-3 topics
- [ ] Save as draft
- [ ] Verify appears in article listing with draft status
- [ ] Edit article
- [ ] Submit for review
- [ ] Verify status changes to "under_review"

#### 4.5 Editor Submission Management (Editor Account)
- [ ] Login as editor
- [ ] Navigate to /editor
- [ ] Verify submitted article appears
- [ ] Click article to view
- [ ] Assign reviewer (select test reviewer account)
- [ ] Add editor notes
- [ ] Save reviewer assignment
- [ ] Verify reviewer notification

#### 4.6 Reviewer Review Flow (Reviewer Account)
- [ ] Login as reviewer
- [ ] Navigate to /reviewer
- [ ] Verify assigned review appears
- [ ] Click review to open
- [ ] Read article content
- [ ] Fill review form:
  - Recommendation: Accept with minor revisions
  - Summary: Comprehensive review summary
  - Strengths: List 3-5 strengths
  - Weaknesses: List 2-3 areas for improvement
  - Detailed comments: Section-by-section feedback
  - Confidential comments: Editor-only notes
- [ ] Submit review
- [ ] Verify success message
- [ ] Navigate back to /reviewer
- [ ] Verify review marked as completed

#### 4.7 Editor Review Processing (Editor Account)
- [ ] Login as editor
- [ ] Navigate to /editor
- [ ] Click submission with completed review
- [ ] Read reviewer's feedback
- [ ] Make editorial decision
- [ ] Notify author
- [ ] Update article status

#### 4.8 Collections Management (Admin Account)
- [ ] Login as admin
- [ ] Navigate to /admin/collections
- [ ] Click "New Collection"
- [ ] Create collection:
  - Title: "Featured AI Research 2025"
  - Description: Collection summary
  - Cover image URL: (optional)
- [ ] Save collection
- [ ] Add articles to collection (drag/drop or search)
- [ ] Reorder articles
- [ ] Publish collection
- [ ] Navigate to /collections (public view)
- [ ] Verify collection appears
- [ ] Click collection
- [ ] Verify articles display correctly

#### 4.9 Issues Management (Admin Account)
- [ ] Login as admin
- [ ] Navigate to /admin/issues (route to be created)
- [ ] Create new issue:
  - Title: "Volume 1, Issue 1 - January 2025"
  - Volume: 1
  - Issue number: 1
  - Description: Issue summary
- [ ] Add articles to issue
- [ ] Publish issue
- [ ] Navigate to /issues (public view)
- [ ] Verify issue appears
- [ ] Click issue
- [ ] Verify table of contents

#### 4.10 Topics Management (Admin Account)
- [ ] Login as admin
- [ ] Navigate to /admin/topics
- [ ] View existing topics (8 default from migration)
- [ ] Add new topic:
  - Name: "Quantum Computing"
  - Description: Topic description
  - Color: #6366f1
- [ ] Save topic
- [ ] Edit existing topic
- [ ] Verify changes saved
- [ ] Delete test topic
- [ ] Verify deletion

#### 4.11 Member Directory (Public)
- [ ] Navigate to /members (logged out)
- [ ] Verify member listings appear
- [ ] Filter by membership grade
- [ ] Filter by expertise tag
- [ ] Click member profile
- [ ] Verify profile details visible
- [ ] Verify visibility respects privacy settings

#### 4.12 Public Routes Verification
- [ ] Test all policy pages load correctly
- [ ] Test article browsing and filtering
- [ ] Test article detail pages
- [ ] Test collections browsing
- [ ] Test issues browsing
- [ ] Verify all public content accessible without auth

---

## Priority 5: Fix Issues Discovered During Testing

### Expected Issues Checklist
Create new issues as discovered:

- [ ] Route access errors
- [ ] Permission check failures
- [ ] Form validation problems
- [ ] UI rendering issues
- [ ] Data not displaying
- [ ] RLS policy blocking legitimate access
- [ ] Missing error messages
- [ ] Redirect problems
- [ ] Session handling issues

### Debugging Approach
1. Check browser console for JavaScript errors
2. Check Network tab for API errors
3. Check Supabase logs for database errors
4. Check Vercel logs for server errors
5. Test locally with production data to reproduce
6. Fix issues in development
7. Test fixes locally
8. Commit and push
9. Wait for deployment
10. Retest in production

---

## Priority 6: Final Comprehensive Test Report

### Success Criteria
- [ ] All 14 public routes return 200
- [ ] All authentication flows complete successfully
- [ ] All RBAC permissions work correctly
- [ ] All workflows (application, article, review) complete end-to-end
- [ ] All admin interfaces functional
- [ ] No JavaScript errors in console
- [ ] No database errors in logs
- [ ] All tests passing locally
- [ ] Production build successful

### Test Coverage Target
- Public routes: 100% (14/14)
- Authentication flows: 100% (8/8)
- RBAC workflows: 100% (12/12)
- Article workflows: 100% (15/15)
- Review system: 100% (10/10)
- Membership applications: 100% (8/8)
- Collections: 100% (6/6)
- Issues: 100% (6/6)
- Admin features: 100% (10/10)

**Target**: 95%+ overall coverage

### Deliverable
Create updated test report:
```
docs/test_reports/production_e2e_final_YYYY-MM-DD.md
```

Include:
- Test execution date/time
- Environment details
- Coverage summary table
- Detailed test results for each flow
- Screenshots of key features
- Performance metrics
- Issues found and fixed
- Recommendations for future testing

---

## Priority 7: Performance & Optimization (If Time Permits)

### Performance Audit
- [ ] Run Lighthouse audit on key pages
- [ ] Check Core Web Vitals (LCP, FID, CLS)
- [ ] Analyze bundle size
- [ ] Check for unnecessary re-renders
- [ ] Optimize images
- [ ] Review database query performance
- [ ] Check RLS policy efficiency

### Potential Optimizations
- [ ] Add loading skeletons for slow queries
- [ ] Implement pagination for long lists
- [ ] Add proper Next.js caching headers
- [ ] Optimize Supabase queries (select only needed columns)
- [ ] Add database indexes where needed
- [ ] Implement incremental static regeneration for public pages

---

## Quick Start Commands for Next Session

### Check Current Status
```bash
# Verify latest commit
git log -1 --oneline

# Check deployment status
npx vercel ls professional-website-2026

# Check Supabase link
supabase status
```

### Apply Migrations
```bash
# Execute all new migrations
for migration in supabase/migrations/20251225*.sql; do
  echo "Applying $migration..."
  supabase db execute -f "$migration"
done

# Verify migrations applied
supabase db execute -c "SELECT * FROM supabase_migrations.schema_migrations ORDER BY version"
```

### Assign Test Account Roles
```bash
# Create role assignment script
cat > assign-roles.mjs << 'EOF'
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf-8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];
const supabase = createClient(url, key);

const roles = [
  { email: 'codex.e2e.admin+20251226024924808@example.com', role: 'admin' },
  { email: 'codex.e2e.editor+20251226024924808@example.com', role: 'editor' },
  { email: 'codex.e2e.reviewer+20251226024924808@example.com', role: 'reviewer' }
];

for (const { email, role } of roles) {
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    const { error } = await supabase.from('roles').upsert({
      user_id: user.id,
      role
    }, { onConflict: 'user_id,role' });
    if (!error) console.log(\`✅ \${role} → \${email}\`);
    else console.error(\`❌ \${email}:\`, error.message);
  }
}
EOF

node assign-roles.mjs
```

### Start Production Testing
```bash
# Open production site in browser
open https://professional-website-2026.vercel.app

# Or test via CLI
curl -I https://professional-website-2026.vercel.app/collections
curl -I https://professional-website-2026.vercel.app/issues
```

### Monitor Logs
```bash
# Watch Vercel deployment logs
npx vercel logs professional-website-2026 --follow

# Check Supabase logs
# https://supabase.com/dashboard/project/cgjzowzomduqwdxolcon/logs/postgres-logs
```

---

## Estimated Time

### If No Issues Found
- Priority 1 (Migrations): 10 minutes
- Priority 2 (Deployment): 5 minutes
- Priority 3 (Role Assignment): 5 minutes
- Priority 4 (E2E Testing): 60-90 minutes
- Priority 5 (Fixes): 0 minutes
- Priority 6 (Report): 15 minutes
**Total**: ~2 hours

### If Minor Issues Found (Expected)
- Priority 1-3: 20 minutes
- Priority 4: 60 minutes
- Priority 5: 30-60 minutes
- Priority 6: 20 minutes
**Total**: ~3 hours

### If Major Issues Found
- Could extend to 4-6 hours depending on complexity

---

## Blockers & Risks

### Known Blockers
1. ⚠️ Migrations may conflict if schema already partially modified manually
   - Mitigation: Migrations use IF NOT EXISTS and DROP IF EXISTS

2. ⚠️ Deployment may take 3-5 minutes to complete
   - Mitigation: Check deployment status before testing

3. ⚠️ Test accounts may be deleted or modified
   - Mitigation: Re-create if needed using documented credentials

### Risks
1. 🔴 **HIGH**: Migration failures could break production database
   - Mitigation: Backup database before applying migrations
   - Supabase has automatic backups, but verify they exist

2. 🟡 **MEDIUM**: RLS policies may be too restrictive
   - Mitigation: Test with multiple account types
   - Add debugging to policies if needed

3. 🟢 **LOW**: Performance issues with large datasets
   - Mitigation: Start with test data, scale gradually

---

## Success Metrics

### Must Have (MVP)
- ✅ All migrations applied without errors
- ✅ All routes accessible (0 x 404 errors)
- ✅ Authentication works for all test accounts
- ✅ RBAC permissions enforce correctly
- ✅ At least one complete workflow tested successfully

### Should Have
- ✅ All major workflows tested end-to-end
- ✅ No critical bugs discovered
- ✅ Test coverage > 80%

### Nice to Have
- ✅ Performance audit completed
- ✅ Test coverage > 95%
- ✅ Zero bugs discovered
- ✅ Documentation updated

---

## Rollback Plan

If critical issues discovered:

### Rollback Migrations
```bash
# Revert last migration
supabase db reset --remote

# Or manually drop tables/columns via SQL editor
```

### Rollback Deployment
```bash
# Redeploy previous commit
git revert HEAD
git push origin main

# Or via Vercel dashboard: redeploy previous version
```

### Disable Features
- Remove routes from navigation
- Add feature flags to disable problematic features
- Display maintenance message to users

---

## Post-Completion Checklist

- [ ] All migrations applied and verified
- [ ] All deployments successful
- [ ] All tests passing in production
- [ ] Test report generated and committed
- [ ] Issues documented and tracked
- [ ] Performance metrics recorded
- [ ] Documentation updated
- [ ] User-facing content reviewed
- [ ] Team notified of completion
- [ ] Monitoring enabled for key features

---

## Notes for Next Session

- Production URL: https://professional-website-2026.vercel.app
- Supabase Dashboard: https://supabase.com/dashboard/project/cgjzowzomduqwdxolcon
- Vercel Dashboard: https://vercel.com/mushier-rouge/professional-website-2026
- Latest commit: fec32a1
- Test accounts password: Test!0b7c002658af

**Current blocker**: Migrations need to be applied before any testing can proceed.
**First action**: Execute Priority 1 (apply migrations)
**Expected duration**: 2-4 hours total

---

*Plan created: 2025-12-26*
*Last updated: 2025-12-26*
*Status: READY FOR EXECUTION*
