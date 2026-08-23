import { store } from './store';
import type { AIChatMessage } from '../types';

export function getFarmAIResponse(userPrompt: string): AIChatMessage {
  const query = userPrompt.toLowerCase();
  const products = store.getProducts();

  let replyText = '';

  if (query.includes('irrigate') || query.includes('water') || query.includes('moisture')) {
    replyText = `💧 **Irrigation Recommendation**: Check the **Weather Center** tab for live OpenWeather API precipitation forecasts. If rain is expected within 24 hours, hold off heavy drip irrigation cycles to save groundwater.`;
  } else if (query.includes('weather') || query.includes('rain') || query.includes('temp') || query.includes('forecast')) {
    replyText = `🌦️ **Weather Outlook**: Live regional telemetry is connected via OpenWeatherMap API. View current temperature, 5-day precipitation forecasts, humidity, and wind radar under the **Weather Center** tab!`;
  } else if (query.includes('trend') || query.includes('market') || query.includes('price') || query.includes('sell')) {
    const topProd = products[0];
    replyText = `📈 **Marketplace Intelligence**: Organic Red Tomatoes and Alphonso Mangoes are currently seeing high demand in regional markets. Grade A FarmCheck verified produce is commanding a **12-15% price premium** over unverified lots. Current listed tomato price is **₹${topProd ? topProd.price : 35}/kg**.`;
  } else if (query.includes('equipment') || query.includes('tractor') || query.includes('rent')) {
    replyText = `🚜 **Equipment Sharing Insight**: Tractors and rotavators are experiencing high rental booking velocity this week for soil preparation. Average tractor rental rate in your area is **₹1,200/day**. You can list unused equipment under the Equipment Hub tab.`;
  } else if (query.includes('quality') || query.includes('farmcheck') || query.includes('score')) {
    replyText = `✓ **FarmCheck Quality Tip**: Produce with a FarmCheck verification score above 90 (Grade A) receives a green verified shield on the marketplace. This increases buyer inquiry speed by up to 3x! Try running FarmCheck under the My Farm tab.`;
  } else {
    replyText = `🌱 **FarmAI Assistant**: FarmSetu is ready to assist you. Active marketplace listings: **${products.length} items**. How can I help you with crop care recommendations, equipment rentals, or marketplace trends?`;
  }

  return {
    id: `msg_${Date.now()}`,
    sender: 'assistant',
    text: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
