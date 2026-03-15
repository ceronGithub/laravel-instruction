/* tabs.js — Code preview tabs + copy buttons */
(function() {

  const CODE_TABS = {
    migration: {
      file: 'database/migrations/create_products_table.php',
      code: `<span class="cm">// Create the products table schema</span>
<span class="kw">public function</span> <span class="fn">up</span>(): <span class="cl">void</span>
{
    Schema::<span class="fn">create</span>(<span class="str">'products'</span>, <span class="kw">function</span> (Blueprint <span class="var">$table</span>) {
        <span class="var">$table</span>-><span class="fn">id</span>();
        <span class="var">$table</span>-><span class="fn">string</span>(<span class="str">'name'</span>);
        <span class="var">$table</span>-><span class="fn">text</span>(<span class="str">'description'</span>)-><span class="fn">nullable</span>();
        <span class="var">$table</span>-><span class="fn">decimal</span>(<span class="str">'price'</span>, <span class="num">10</span>, <span class="num">2</span>);
        <span class="var">$table</span>-><span class="fn">integer</span>(<span class="str">'stock'</span>)-><span class="fn">default</span>(<span class="num">0</span>);
        <span class="var">$table</span>-><span class="fn">string</span>(<span class="str">'image'</span>)-><span class="fn">nullable</span>();
        <span class="var">$table</span>-><span class="fn">boolean</span>(<span class="str">'is_featured'</span>)-><span class="fn">default</span>(<span class="kw">false</span>);
        <span class="var">$table</span>-><span class="fn">foreignId</span>(<span class="str">'category_id'</span>)-><span class="fn">constrained</span>()-><span class="fn">cascadeOnDelete</span>();
        <span class="var">$table</span>-><span class="fn">timestamps</span>();
    });
}`
    },
    model: {
      file: 'app/Models/Product.php',
      code: `<span class="cm">// Eloquent model with relationships + scopes</span>
<span class="kw">class</span> <span class="cl">Product</span> <span class="kw">extends</span> <span class="cl">Model</span>
{
    <span class="kw">use</span> <span class="cl">HasFactory</span>;

    <span class="kw">protected</span> <span class="var">$fillable</span> = [
        <span class="str">'name'</span>, <span class="str">'description'</span>, <span class="str">'price'</span>,
        <span class="str">'stock'</span>, <span class="str">'image'</span>, <span class="str">'is_featured'</span>, <span class="str">'category_id'</span>,
    ];

    <span class="kw">protected</span> <span class="var">$casts</span> = [
        <span class="str">'price'</span>       => <span class="str">'float'</span>,
        <span class="str">'is_featured'</span> => <span class="str">'boolean'</span>,
    ];

    <span class="kw">public function</span> <span class="fn">category</span>() {
        <span class="kw">return</span> <span class="var">$this</span>-><span class="fn">belongsTo</span>(<span class="cl">Category</span>::<span class="kw">class</span>);
    }

    <span class="kw">public function</span> <span class="fn">scopeInStock</span>(<span class="var">$query</span>) {
        <span class="kw">return</span> <span class="var">$query</span>-><span class="fn">where</span>(<span class="str">'stock'</span>, <span class="str">'>'</span>, <span class="num">0</span>);
    }
}`
    },
    controller: {
      file: 'app/Http/Controllers/ProductController.php',
      code: `<span class="cm">// Resource controller — handles all CRUD routes</span>
<span class="kw">class</span> <span class="cl">ProductController</span> <span class="kw">extends</span> <span class="cl">Controller</span>
{
    <span class="kw">public function</span> <span class="fn">index</span>(<span class="cl">Request</span> <span class="var">$request</span>)
    {
        <span class="var">$products</span> = <span class="cl">Product</span>::<span class="fn">with</span>(<span class="str">'category'</span>)
            -><span class="fn">inStock</span>()
            -><span class="fn">when</span>(<span class="var">$request</span>->search,
                <span class="kw">fn</span>(<span class="var">$q</span>, <span class="var">$s</span>) => <span class="var">$q</span>-><span class="fn">where</span>(<span class="str">'name'</span>, <span class="str">'like'</span>, <span class="str">"%{$s}%"</span>)
            )
            -><span class="fn">latest</span>()-><span class="fn">paginate</span>(<span class="num">12</span>);

        <span class="kw">return</span> <span class="fn">view</span>(<span class="str">'products.index'</span>, <span class="fn">compact</span>(<span class="str">'products'</span>));
    }

    <span class="kw">public function</span> <span class="fn">store</span>(<span class="cl">StoreProductRequest</span> <span class="var">$request</span>)
    {
        <span class="cl">Product</span>::<span class="fn">create</span>(<span class="var">$request</span>-><span class="fn">validated</span>());
        <span class="kw">return</span> <span class="fn">redirect</span>()-><span class="fn">route</span>(<span class="str">'products.index'</span>)
            -><span class="fn">with</span>(<span class="str">'success'</span>, <span class="str">'Product created!'</span>);
    }
}`
    },
    ajax: {
      file: 'resources/js/cart.js',
      code: `<span class="cm">// AJAX add-to-cart — works for auth + guest users</span>
<span class="kw">async function</span> <span class="fn">addToCart</span>(productId, btn) {
    btn.disabled = <span class="kw">true</span>;
    btn.textContent = <span class="str">'Adding...'</span>;

    <span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">\`/cart/add/\${productId}\`</span>, {
        method: <span class="str">'POST'</span>,
        headers: {
            <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>,
            <span class="str">'Accept'</span>:       <span class="str">'application/json'</span>,
            <span class="str">'X-CSRF-TOKEN'</span>: document
                .<span class="fn">querySelector</span>(<span class="str">'meta[name="csrf-token"]'</span>).content,
        },
        body: <span class="cl">JSON</span>.<span class="fn">stringify</span>({ quantity: <span class="num">1</span> }),
    });

    <span class="kw">if</span> (res.status === <span class="num">401</span>) {
        window.location.href = <span class="str">'/login'</span>; <span class="cm">// guest → redirect</span>
        <span class="kw">return</span>;
    }

    <span class="kw">const</span> data = <span class="kw">await</span> res.<span class="fn">json</span>();
    document.<span class="fn">getElementById</span>(<span class="str">'cart-badge'</span>).textContent = data.cartCount;
    btn.textContent = <span class="str">'✓ Added!'</span>;
    <span class="fn">setTimeout</span>(() => { btn.textContent = <span class="str">'Add to Cart'</span>; btn.disabled = <span class="kw">false</span>; }, <span class="num">2000</span>);
}`
    }
  };

  // Render tabs
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const codeContent = document.getElementById('codeTabContent');
  const codeTitle   = document.getElementById('codeTabTitle');

  function setTab(key) {
    const tab = CODE_TABS[key];
    if (!tab || !codeContent) return;
    tabBtns.forEach(b => b.classList.toggle('tab-btn--active', b.dataset.tab === key));
    codeContent.innerHTML = tab.code;
    codeContent.className = 'code-window__body code-window__body--pre code-tab-enter';
    if (codeTitle) codeTitle.textContent = tab.file;
    setTimeout(() => codeContent.classList.remove('code-tab-enter'), 300);
  }

  tabBtns.forEach(btn => btn.addEventListener('click', () => setTab(btn.dataset.tab)));
  if (codeContent) setTab('migration');

  // Copy buttons — works on any page
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.code-block__copy');
    if (!btn) return;
    const pre = btn.closest('.code-block')?.querySelector('pre');
    if (!pre) return;
    const text = pre.innerText || pre.textContent || '';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => flashCopy(btn)).catch(() => fallbackCopy(text, btn));
    } else {
      fallbackCopy(text, btn);
    }
  });

  function flashCopy(btn) {
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.color = '#00d68f';
    btn.style.borderColor = '#00d68f';
    setTimeout(() => { btn.textContent = orig; btn.style.color = ''; btn.style.borderColor = ''; }, 2000);
  }

  function fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); flashCopy(btn); } catch(e) {}
    document.body.removeChild(ta);
  }

})();
