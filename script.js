(async function downloadAllTickets() {
  const DOWNLOAD_BTN_SELECTOR = '#root-modal > div > div > div > div > div > div > div._containerButton_v8e4r_34 > button';
  const DELAY_BETWEEN = 2500;   // ms entre chaque téléchargement
  const MODAL_TIMEOUT = 8000;   // ms max pour attendre l'ouverture de la modale
  // Trouver les lignes de paiement
  const allRows = Array.from(document.querySelectorAll('div._containerOSS_7aoby_1'));
  
  const paymentRows = allRows.filter(row => {
    // Exclure les rechargements (ont la classe _credit_7aoby_50)
    return !row.querySelector('._credit_7aoby_50');
  });
  console.log(`Transactions totales trouvées : ${allRows.length}`);
  console.log(`Paiements à télécharger : ${paymentRows.length}`);
  if (paymentRows.length === 0) {
    console.error('Aucun paiement trouvé. Vérifiez que vous êtes bien sur la page de liste des transactions.');
    return;
  }
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const waitForElement = (selector, timeout = MODAL_TIMEOUT) => {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const observer = new MutationObserver(() => {
        const found = document.querySelector(selector);
        if (found) {
          observer.disconnect();
          resolve(found);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout: élément "${selector}" non trouvé après ${timeout}ms`));
      }, timeout);
    });
  };
  const closeModal = () => {
    // Essaie plusieurs façons de fermer la modale
    const closeBtn = document.querySelector('#root-modal [aria-label="close"], #root-modal .close, #root-modal button[class*="close"]');
    if (closeBtn) {
      closeBtn.click();
      return;
    }
    // Clic en dehors de la modale (backdrop)
    const backdrop = document.querySelector('#root-modal > div');
    if (backdrop) backdrop.click();
    // Touche Escape en dernier recours
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  };
  const isModalClosed = () => !document.querySelector('#root-modal > div');

  let successCount = 0;
  let errorCount = 0;
  for (let i = 0; i < paymentRows.length; i++) {
    const row = paymentRows[i];
    // Récupère les infos de la ligne pour les logs
    const titleEl = row.querySelector('._heading3_1dbb2_64');
    const dateEl  = row.querySelector('._date_7aoby_44');
    const amountEl = row.querySelector('._amount_7aoby_36');
    const label = `${titleEl?.textContent?.trim() ?? '?'} | ${dateEl?.textContent?.trim() ?? '?'} | ${amountEl?.textContent?.trim() ?? '?'}`;
    console.log(`(${i + 1}/${paymentRows.length}) ${label}`);
    try {
      // Clic sur la ligne pour ouvrir la modale
      row.click();
      // Attendre que le bouton de téléchargement apparaisse dans la modale
      const downloadBtn = await waitForElement(DOWNLOAD_BTN_SELECTOR);
      // Petit délai pour s'assurer que la modale est bien chargée
      await sleep(500);
      // Cliquer sur télécharger
      downloadBtn.click();
      successCount++;
      console.log(`Téléchargement lancé`);
      // Attendre un peu avant de fermer (laisser le temps au navigateur de déclencher le téléchargement)
      await sleep(800);
      // Fermer la modale
      closeModal();
      // Attendre la fermeture effective de la modale
      let waited = 0;
      while (!isModalClosed() && waited < 3000) {
        await sleep(200);
        waited += 200;
      }
      // Délai avant la prochaine itération
      await sleep(DELAY_BETWEEN);
    } catch (err) {
      errorCount++;
      console.error(`  ✗ Erreur : ${err.message}`);
      // Tenter de fermer la modale quand même
      closeModal();
      await sleep(1000);
    }
  }
  console.log(`\nTerminé`);
  console.log(`  Succès : ${successCount}`);
  console.log(`  Erreurs : ${errorCount}`);
  console.log(`  Total   : ${paymentRows.length}`);
})();
