from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit

root = Path(__file__).resolve().parents[1]
class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.refs = set(), []
        self.h1, self.csp = 0, False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, 'Duplicate id'
            self.ids.add(a['id'])
        self.h1 += tag == 'h1'
        assert not any(k.startswith('on') for k in a), 'Inline handler'
        assert 'style' not in a and tag != 'style', 'Inline CSS'
        if tag == 'script':
            assert a.get('src'), 'Inline script'
        if tag == 'meta' and a.get('http-equiv', '').lower() == 'content-security-policy':
            self.csp = True
            assert "connect-src 'none'" in a['content']
            assert 'unsafe-inline' not in a['content']
        self.refs.extend(a[k] for k in ('src', 'href') if k in a)

c = Check()
c.feed((root / 'index.html').read_text(encoding='utf-8'))
assert c.h1 == 1 and c.csp
for value in c.refs:
    u = urlsplit(value)
    assert not u.scheme and not u.netloc, 'External asset'
    if u.path:
        p = (root / u.path).resolve()
        assert p.is_relative_to(root) and p.is_file(), value
    if u.fragment:
        assert u.fragment in c.ids, value
print('PASS: HTML structure, local links and basic policy checks')
