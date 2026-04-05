const fs = require('fs');
const p = 'src/app/hackathons/[slug]/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const t1 = `<Button asChild variant="secondary" size="sm" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800">
                  <Link href={details.sections.info.links.rules} target="_blank"><FileText className="w-4 h-4 mr-1.5" /> 규정</Link>
                </Button>`;

const t1r = `<Button onClick={() => setDocModalState({isOpen: true, type: 'rules'})} variant="secondary" size="sm" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800">
                  <FileText className="w-4 h-4 mr-1.5" /> 규정
                </Button>`;

const t2 = `<Button asChild variant="secondary" size="sm" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800">
                  <Link href={details.sections.info.links.faq} target="_blank"><HelpCircle className="w-4 h-4 mr-1.5" /> FAQ</Link>
                </Button>`;

const t2r = `<Button onClick={() => setDocModalState({isOpen: true, type: 'faq'})} variant="secondary" size="sm" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800">
                  <HelpCircle className="w-4 h-4 mr-1.5" /> FAQ
                </Button>`;

const t3 = `<InfoSection info={details.sections.info} />`;
const t3r = `<InfoSection info={details.sections.info} onOpenDoc={(type) => setDocModalState({isOpen: true, type})} />`;

const t4 = `{/* Padding for mobile fixed bar */}`;
const t4r = `{/* Document Modal */}
      <DocumentModal
        isOpen={docModalState.isOpen}
        onOpenChange={(isOpen) => setDocModalState(prev => ({ ...prev, isOpen }))}
        type={docModalState.type}
        hackathonTitle={details.title}
      />

      {/* Padding for mobile fixed bar */}`;

// Normalize line endings for replacement string split
const norm = (s) => s.replace(/\r\n/g, '\n');

c = norm(c);

c = c.split(norm(t1)).join(t1r);
c = c.split(norm(t2)).join(t2r);
c = c.split(t3).join(t3r);
c = c.split(t4).join(t4r);

fs.writeFileSync(p, c, 'utf8');
console.log('Patch complete.');
