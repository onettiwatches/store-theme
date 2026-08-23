if (!customElements.get('infinite-product-grid')) {
  customElements.define(
    'infinite-product-grid',
    class InfiniteProductGrid extends HTMLElement {
      connectedCallback() {
        this.grid = this.querySelector('#product-grid');
        this.status = this.querySelector('[data-infinite-status]');
        this.nextUrl = this.dataset.nextUrl || '';
        this.sectionId = this.dataset.sectionId || (this.grid && this.grid.dataset.id) || '';
        this.loading = false;

        if (!this.grid || !this.status || !this.nextUrl || !this.sectionId) return;

        this.observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) this.loadMore();
          },
          { rootMargin: '0px 0px 800px 0px' }
        );
        this.observer.observe(this.status);
      }

      disconnectedCallback() {
        if (this.observer) this.observer.disconnect();
        if (this.abortController) this.abortController.abort();
      }

      loadMore() {
        if (this.loading || !this.nextUrl) return;

        this.loading = true;
        this.abortController = new AbortController();
        this.setAttribute('aria-busy', 'true');

        const url = new URL(this.nextUrl, window.location.origin);
        url.searchParams.set('section_id', this.sectionId);

        fetch(url.toString(), { signal: this.abortController.signal })
          .then((response) => {
            if (!response.ok) throw new Error(response.statusText);
            return response.text();
          })
          .then((html) => {
            this.appendPage(html);
            this.loading = false;
            this.removeAttribute('aria-busy');
            if (!this.nextUrl || !this.status || !this.observer) return;
            this.observer.unobserve(this.status);
            this.observer.observe(this.status);
          })
          .catch((error) => {
            this.loading = false;
            this.removeAttribute('aria-busy');
            if (error.name === 'AbortError') return;
          });
      }

      appendPage(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newGrid = doc.getElementById('product-grid');
        const nextHost = doc.querySelector('infinite-product-grid');

        if (newGrid) {
          const fragment = document.createDocumentFragment();
          Array.from(newGrid.children).forEach((item) => {
            item.querySelectorAll('img').forEach((img) => {
              img.loading = 'lazy';
              img.decoding = 'async';
            });
            fragment.appendChild(document.importNode(item, true));
          });
          this.grid.appendChild(fragment);
        }

        this.nextUrl = (nextHost && nextHost.dataset.nextUrl) || '';
        if (!this.nextUrl) {
          if (this.status) this.status.hidden = true;
          if (this.observer) this.observer.disconnect();
        }
      }
    }
  );
}
