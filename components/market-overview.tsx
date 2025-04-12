"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Coins } from "lucide-react"

// Define types for the fetched data
type Crypto = {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
}

type MarketData = {
  bitcoin_percentage_of_market_cap: number
  total_market_cap: { usd: number } // Assuming it's in USD, adapt if the API structure differs
  total_24h_volume: { usd: number } // Assuming it's in USD, adapt if the API structure differs
}

export function MarketOverview() {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [fearGreedIndex, setFearGreedIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,polkadot&order=market_cap_desc"
        )
        const data = await res.json()
        setCryptoData(data)
      } catch (err) {
        console.error("Error fetching crypto data:", err)
      }
    }

    const fetchMarketData = async () => {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/global")
        const data = await res.json()
        setMarketData(data.data)
      } catch (err) {
        console.error("Error fetching market data:", err)
      }
    }

    const fetchFearGreedIndex = async () => {
      try {
        const res = await fetch("https://api.alternative.me/fng/")
        const data = await res.json()
        setFearGreedIndex(data.data[0].value)
      } catch (err) {
        console.error("Error fetching Fear & Greed Index:", err)
      }
    }

    fetchCryptoData()
    fetchMarketData()
    fetchFearGreedIndex()

    const interval = setInterval(fetchCryptoData, 60000) // Refresh every minute
    const clock = setInterval(() => setCurrentTime(new Date()), 60000)

    return () => {
      clearInterval(interval)
      clearInterval(clock)
    }
  }, [])

  return (
    <div className="space-y-4">
      <Card className="glass-card border-[#2D5BFF]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-[#00E676]" />
            Market Overview
          </CardTitle>
          <p className="text-xs text-gray-400">
            Last updated: {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            {cryptoData.map((crypto) => (
              <div key={crypto.id} className="flex items-center justify-between py-1">
                <div className="flex items-center">
                  {crypto.symbol === "btc" ? (
                    <div className="mr-2 h-5 w-5 flex items-center justify-center rounded-full bg-[#f7931a] text-white font-bold text-xs">
                      ₿
                    </div>
                  ) : (
                    <Coins className="mr-2 h-5 w-5 text-[#2D5BFF]" />
                  )}
                  <div>
                    <div className="font-medium">{crypto.name}</div>
                    <div className="text-xs text-gray-400">{crypto.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${crypto.current_price.toLocaleString()}</div>
                  <div
                    className={`flex items-center text-xs ${crypto.price_change_percentage_24h >= 0 ? "text-[#00E676]" : "text-red-500"
                      }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Sentiment and Stats */}
      <Card className="glass-card border-[#2D5BFF]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Market Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm">Fear & Greed Index</span>
              <span className="text-sm font-medium text-[#00E676]">
                {fearGreedIndex !== null ? `${fearGreedIndex} - ${fearGreedIndex >= 50 ? 'Greed' : 'Fear'}` : 'Loading...'}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                style={{ width: fearGreedIndex ? `${fearGreedIndex}%` : "0%" }}
              ></div>
            </div>
          </div>

          {marketData ? (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>BTC Dominance</span>
                <span>{marketData.bitcoin_percentage_of_market_cap?.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Total Market Cap</span>
                <span>
                  {marketData.total_market_cap
                    ? `$${marketData.total_market_cap.usd.toLocaleString()}`
                    : "Loading..."}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>24h Volume</span>
                <span>
                  {marketData.total_24h_volume
                    ? `$${marketData.total_24h_volume.usd.toLocaleString()}`
                    : "Loading..."}
                </span>
              </div>
            </div>
          ) : (
            <p>Loading market data...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
