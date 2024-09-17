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

enum Settings {
  stats = "stats",
  players = "players"
}
type DataDisplay = {
  currentShow: number
  data: {
    _id?: string
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
    setDisplayStats({currentShow: MAX_DISPLAY_STATS, data: Object.keys(data[0] || {}).map((stat) => ({name: stat, isShow: DEFAULT_STATS.includes(stat)}))})
    setDisplayPlayers({currentShow: data.length, data: data.map((player) => ({_id: player._id, name: player.name, isShow: true}))})
  }, [data])

  // settings object
  // Object: setting - isShow -> stats : false
  const [showSettings, setShowSettings] = useState({
    stats: false,
    players: false
  })
  const initDataDisplay = {currentShow: 0, data: []}
  const [displayStats, setDisplayStats] = useState<DataDisplay>(initDataDisplay)
  const [displayPlayers, setDisplayPlayers] = useState<DataDisplay>(initDataDisplay)
  const showStatsBars = displayStats.data.filter(({isShow}) => isShow).map((stat, index) => {
    return <Bar key={stat.name} name={beautifyWord(stat.name)} dataKey={stat.name} fill={COLOR_CODE[index]} />
  })
  const showData = (e:React.ChangeEvent<HTMLInputElement>, data: string, setting: Settings) => {
    switch (setting) {
      case Settings.stats:
        setDisplayStats({
          ...displayStats,
          currentShow: e.target.checked ? displayStats.currentShow + 1 : displayStats.currentShow - 1,
          data: displayStats.data.map((displayStat) => displayStat.name === data ? {...displayStat, isShow: e.target.checked} : displayStat)
        })
        break
      case Settings.players:
        setDisplayPlayers({
          ...displayPlayers,
          currentShow: e.target.checked ? displayPlayers.currentShow + 1 : displayPlayers.currentShow - 1,
          data: displayPlayers.data.map((displayPlayer) => displayPlayer._id === data ? {...displayPlayer, isShow: e.target.checked} : displayPlayer)
        })
        break
      default:
        return
    }

  }
  const showStats = (e:React.ChangeEvent<HTMLInputElement>, stat: string) => {
    if (displayStats.currentShow === MAX_DISPLAY_STATS && e.target.checked) {
      setErrorMessage("You can only show up to 5 stats")
      return
    }
    if (displayStats.currentShow === MIN_DISPLAY_STATS && !e.target.checked) {
      setErrorMessage("Must show at least 1 stat")
      return
    }
    showData(e, stat, Settings.stats)
    // if (displayStats.currentShow === MIN_DISPLAY_STATS && !e.target.checked) {
    //   setErrorMessage("Must show at least 1 stat")
    //   return
    // }
    // setDisplayStats({
    //   ...displayStats,
    //   currentShow: e.target.checked ? displayStats.currentShow + 1 : displayStats.currentShow - 1,
    //   data: displayStats.data.map((displayStat) => displayStat.name === stat ? {...displayStat, isShow: e.target.checked} : displayStat)
    // })
    // switch (e.target.checked) {
    //   case true:
    //     if (displayStats.currentShow === MAX_DISPLAY_STATS) {
    //       setErrorMessage("You can only show up to 5 stats")
    //       return
    //     } else {
    //       setDisplayStats({
    //         ...displayStats,
    //         currentShow: displayStats.currentShow + 1,
    //         data: displayStats.data.map((displayStat) => displayStat.name === stat ? {...displayStat, isShow: true} : displayStat)
    //       })
    //     }
    //     break
    //   default:
    //     if (displayStats.currentShow === MIN_DISPLAY_STATS) {
    //       setErrorMessage("Must show at least 1 stat")
    //       return
    //     } else {
    //       setDisplayStats({
    //         ...displayStats,
    //         currentShow: displayStats.currentShow - 1,
    //         data: displayStats.data.map((displayStat) => displayStat.name === stat ? {...displayStat, isShow: false} : displayStat)
    //       })
    //     }
    // }
  }
  const showPlayers = (e:React.ChangeEvent<HTMLInputElement>, playerId: string | undefined) => {
    if (displayPlayers.currentShow === MIN_DISPLAY_STATS && !e.target.checked) {
      setErrorMessage("Must show at least 1 player")
      return
    }
    if (playerId) showData(e, playerId, Settings.players)
  }

  const createBarChart = (data: Player[]) => {
    const displayPlayerIds = displayPlayers.data.filter(({isShow}) => isShow).map(({_id}) => _id)
    const chunkedData = chunk(data.filter(data => displayPlayerIds.includes(data._id)), 10)
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
              checked={showSettings.stats}
              onChange={(value) => {
                setShowSettings({...showSettings, stats: value.target.checked})
              }}
            />
          </div>
        </div>
        {displayStats && showSettings.stats?
        <div className="grid grid-cols-5">
          {displayStats.data.map((stat) => {
            return <div><input key={stat.name} type="checkbox" checked={stat.isShow} onChange={(e) => {showStats(e, stat.name)}}/> {beautifyWord(stat.name)}</div>
          })}
        </div>: <></>}
        <div className="flex items-center gap-2">
          <Typography>Players</Typography>
          <div>
            <Switch
              color="primary"
              checked={showSettings.players}
              onChange={(value) => {
                setShowSettings({...showSettings, players: value.target.checked})
              }}
            />
          </div>
        </div>
        {displayPlayers && showSettings.players?
        <div className="grid grid-cols-5">
          {displayPlayers.data.map((player) => {
            return <div><input key={player._id} type="checkbox" checked={player.isShow} onChange={(e) => {showPlayers(e, player._id)}}/> {beautifyWord(player.name)}</div>
          })}
        </div>: <></>}
      </div>
      {createBarChart(data)}
    </>
  )
}