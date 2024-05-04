import { Switch, Typography } from "@mui/material"
import { chunk } from "lodash"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Player } from "src/types"
import { beautifyWord } from "src/utils/beautify"

type ChartProps = {
  data: Player[]
  setErrorMessage: (message: string) => void
}

type PlayerStats = {
  currentShow: number
  stats: {
    name: string
    isShow: boolean
  }[]
}

const COLOR_CODE = [
  "#33B2FF", "#33FF71", "#FF9633", "#F72626", "#A056FA"
]
const MAX_DISPLAY_STATS = 5
const MIN_DISPLAY_STATS = 1
const DEFAULT_STATS = ["points", "goals", "secondAssists", "assists", "totalAssists"]
export const CustomBarChart: React.FC<ChartProps> = ({ data, setErrorMessage }) => {
  useEffect(() => {
    setDisplayStats({currentShow: MAX_DISPLAY_STATS, stats: Object.keys(data[0] || {}).map((stat) => ({name: stat, isShow: DEFAULT_STATS.includes(stat)}))})
  }, [data])

  const [showSettings, setShowSettings] = useState(false)
  const [displayStats, setDisplayStats] = useState<PlayerStats>({currentShow: 0, stats: []})
  const showStatsBars = displayStats.stats.filter(({isShow}) => isShow).map((stat, index) => {
    return <Bar key={stat.name} name={beautifyWord(stat.name)} dataKey={stat.name} fill={COLOR_CODE[index]} />
  })
  const showStats = (e:React.ChangeEvent<HTMLInputElement>, stat: string) => {
    switch (e.target.checked) {
      case true:
        if (displayStats.currentShow === MAX_DISPLAY_STATS) {
          setErrorMessage("You can only show up to 5 stats")
          return
        } else {
          setDisplayStats({
            ...displayStats,
            currentShow: displayStats.currentShow + 1,
            stats: displayStats.stats.map((displayStat) => displayStat.name === stat ? {...displayStat, isShow: true} : displayStat)
          })
        }
        break
      default:
        if (displayStats.currentShow === MIN_DISPLAY_STATS) {
          setErrorMessage("Must show at least 1 stats")
          return
        } else {
          setDisplayStats({
            ...displayStats,
            currentShow: displayStats.currentShow - 1,
            stats: displayStats.stats.map((displayStat) => displayStat.name === stat ? {...displayStat, isShow: false} : displayStat)
          })
        }
    }
  }

  const createBarChart = (data: Player[]) => {
    const chunkedData = chunk(data, 10)
    return chunkedData.map((chunkData, index) => {
      return (
        <ResponsiveContainer key={index} minWidth={750} minHeight={250} width="100%" height="50%">
          <BarChart data={chunkData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {showStatsBars}
          </BarChart>
        </ResponsiveContainer>
      )
    })
  }

  return (
    <>
      <div>
        <div className="flex items-center gap-2">
          <Typography>Stats</Typography>
          <div>
            <Switch
              color="primary"
              checked={showSettings}
              onChange={(value) => {
                setShowSettings(value.target.checked)
              }}
            />
          </div>
        </div>
        {displayStats && showSettings?
        <div className="grid grid-cols-5">
          {displayStats.stats.map((stat) => {
            return <div><input key={stat.name} type="checkbox" checked={stat.isShow} onChange={(e) => {showStats(e, stat.name)}}/> {beautifyWord(stat.name)}</div>
          })}
        </div>: <></>}
      </div>
      {createBarChart(data)}
    </>
  )
}