import { Button, TextField, Snackbar, IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import Table from "components/Table"
import { useEffect, useState } from "react"
import { useLazyGetStatsByTeamIdQuery } from "src/store/statsSlice"
import { Player } from "src/types"
import { CustomBarChart } from "components/Chart"

export const Dashboard = () => {
  const [ trigger, { data: queryData = []} ] = useLazyGetStatsByTeamIdQuery()
  const [data, setData] = useState<Player[]>([])
  const [year, setYear] = useState(new Date().getFullYear())
  const [error, setError] = useState({
    open: false,
    message: '',
  })

  const getData = () => {
    trigger({ teamId: 1, year: year })
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const onlyNums = Number(e.target.value.replace(/[^0-9]/g, ''));
    setYear(onlyNums)
  }

  const handleClose = () => {
    setError({ ...error, open: false });
  };

  const setErrorMessage = (message: string) => {
    setError({ ...error, open: true, message });
  }

  useEffect(() => {
    setData(queryData)
  }, [queryData])

  useEffect(() => {
    getData()
  },[])

  const errorAction = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={error.open}
        onClose={handleClose}
        message={error.message}
        autoHideDuration={5000}
        action={errorAction}
        key="topright"
      />
    <div className="m-2">
      <div>
        <div>
          <TextField label="Year" variant="outlined" value={year.toString()} onChange={(e) => {handleYearChange(e)}}/>
        </div>
        <div>
          <Button onClick={getData}>Get Data</Button>
        </div>
      </div>
      <Table data={data}/>
      <div>
        <CustomBarChart data={data} setErrorMessage={setErrorMessage}/>
      </div>
    </div>
    </>
  )
}