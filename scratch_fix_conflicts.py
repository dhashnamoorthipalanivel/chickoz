import os
files = [
    'backend/controllers/leadController.js',
    'backend/public/index.html',
    'frontend/src/pages/CRM/Lead/LeadStageForm.jsx',
    'frontend/src/pages/Manufacture/Kishok/KishokStageForm.jsx',
    'frontend/src/pages/Subscription/Subscription.jsx'
]
for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    state = 'NORMAL' # NORMAL, IN_HEAD, IN_REMOTE
    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            state = 'IN_HEAD'
            continue
        elif line.startswith('======='):
            if state == 'IN_HEAD':
                state = 'IN_REMOTE'
            else:
                new_lines.append(line)
            continue
        elif line.startswith('>>>>>>>'):
            if state == 'IN_REMOTE':
                state = 'NORMAL'
            else:
                new_lines.append(line)
            continue
            
        if state == 'IN_HEAD':
            new_lines.append(line)
        elif state == 'NORMAL':
            new_lines.append(line)
            
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Fixed {file_path}")
