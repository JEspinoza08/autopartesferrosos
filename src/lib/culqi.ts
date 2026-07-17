declare global {
  interface Window {
    Culqi?: any;
    culqi?: () => void;
  }
}

let loadingPromise: Promise<void> | null = null;

export function loadCulqiCheckout(): Promise<void> {
  if (window.Culqi) return Promise.resolve();
  if (loadingPromise) return loadingPromise;
  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.culqi.com/js/v4';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar Culqi Checkout.'));
    document.body.appendChild(script);
  });
  return loadingPromise;
}

export async function openCulqiCheckout(options: {
  amount: number;
  email: string;
  title?: string;
  description?: string;
}): Promise<{ token: string; email: string; installments: number }> {
  await loadCulqiCheckout();
  const publicKey = import.meta.env.VITE_CULQI_PUBLIC_KEY;
  if (!publicKey) throw new Error('Falta VITE_CULQI_PUBLIC_KEY en el archivo .env.');

  return new Promise((resolve, reject) => {
    const Culqi = window.Culqi;
    Culqi.publicKey = publicKey;
    Culqi.settings({
      title: options.title ?? 'Autopartes Ferrosos',
      currency: 'PEN',
      amount: Math.round(options.amount * 100),
      description: options.description ?? 'Compra en Autopartes Ferrosos',
    });
    Culqi.options({
      lang: 'es',
      installments: true,
      paymentMethods: { tarjeta: true, yape: false, bancaMovil: false, agente: false, billetera: false, cuotealo: false },
      style: { buttonBackground: '#B91C1C', linksColor: '#B91C1C', priceColor: '#B91C1C', buttonText: 'Pagar' },
    });

    window.culqi = () => {
      if (Culqi.token) {
        const token = Culqi.token;
        Culqi.close();
        resolve({ token: token.id, email: token.email ?? options.email, installments: Number(token.metadata?.installments ?? 1) || 1 });
      } else {
        const message = Culqi.error?.user_message ?? Culqi.error?.merchant_message ?? 'No se pudo tokenizar la tarjeta.';
        Culqi.close();
        reject(new Error(message));
      }
    };
    Culqi.open();
  });
}
