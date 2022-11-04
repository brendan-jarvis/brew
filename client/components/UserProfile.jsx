import React, { useState, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import {
  Alert,
  Box,
  LinearProgress,
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material'

const UserProfile = ({ session }) => {
  const { username } = useParams()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    getProfile()
  }, [username])

  const getProfile = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'username, avatar_url, website, recipes(id, name, inserted_at, updated_at)'
        )
        .eq('username)', username)
        .single()

      if (error) {
        if (session.user) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('User not found!')
        }
        throw error
      }

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      {errorMessage ? (
        <>
          <Alert severity="error">{errorMessage}</Alert>
          <Typography variant="h2" textAlign="center">
            Sorry, we couldn&apos;t load a profile for {username}!
          </Typography>
        </>
      ) : loading ? (
        <Box textAlign="center">
          <LinearProgress color="secondary">
            <span className="visually-hidden">Loading...</span>
          </LinearProgress>
        </Box>
      ) : (
        <>
          <Typography variant="h1" textAlign="center">
            {profile?.username}
          </Typography>
          {profile?.website && (
            <Typography variant="h3" textAlign="center">
              Website: {profile?.website}
            </Typography>
          )}
          {profile?.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={`${profile?.username}'s avatar'`}
            />
          )}
          {profile?.recipes ? (
            <>
              <Typography variant="h3" textAlign="center">
                User Recipes
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Added On</TableCell>
                    <TableCell>Updated On</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profile?.recipes?.map((recipe) => (
                    <TableRow key={recipe?.name}>
                      <TableCell>
                        <NavLink to={`/recipes/${recipe?.id}`}>
                          {recipe?.name}
                        </NavLink>
                      </TableCell>
                      <TableCell style={{ textTransform: 'capitalize' }}>
                        {new Date(recipe?.inserted_at).toDateString()}
                      </TableCell>
                      <TableCell style={{ textTransform: 'capitalize' }}>
                        {new Date(recipe?.updated_at).toDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <Typography variant="body1" textAlign="center">
              This user has not uploaded any recipes yet!
            </Typography>
          )}
        </>
      )}
    </Container>
  )
}

export default UserProfile
