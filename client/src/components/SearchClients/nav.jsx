import {
  createStyles,
  Navbar,
  UnstyledButton,
  Text,
  Group,
  ActionIcon,
} from '@mantine/core';
import {
  IconCheckbox,
  IconSearch,
  IconPlus,
  IconReportSearch,
  IconEdit,
  IconBuildingCottage,
} from '@tabler/icons';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ClientContext } from '../clientContext';
import SearchBar from './SearchBar';
import AddNewClient from './addNewClient';
import './nav.css';

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
  },

  section: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    marginBottom: theme.spacing.md,

    '&:not(:last-of-type)': {
      borderBottom: `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[4]
        }`,
    },
  },

  mainLinks: {
    paddingLeft: theme.spacing.md - theme.spacing.xs,
    paddingRight: theme.spacing.md - theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: theme.fontSizes.lg,
    padding: `8px ${theme.spacing.xs}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[8],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
  },

  collections: {
    paddingLeft: theme.spacing.md - 6,
    paddingRight: theme.spacing.md - 6,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: theme.spacing.md + 2,
    paddingRight: theme.spacing.md,
    marginBottom: 5,
  },

  collectionLink: {
    display: 'block',
    padding: `8px ${theme.spacing.xs}px`,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },
}));


export function NavbarSearch({ loggedIn }) {
  const { classes } = useStyles();
  const { client, setClient } = useContext(ClientContext);
  const [opened, setOpened] = useState(false);

  const clearLocalStorageSession = () => {
    localStorage.clear();
    sessionStorage.clear();
  }

  const links = [
    { icon: IconReportSearch, label: 'Past Surveys', urlEndPoint: `past-surveys/${client ? client.ClientId : ''}` },
    { icon: IconCheckbox, label: 'New Survey', urlEndPoint: `new-survey/${client ? client.ClientId : ''}` },
    { icon: IconBuildingCottage, label: 'Properties', color: '#2d862f', urlEndPoint: `properties/${client ? client.ClientId : ''}` },
    { icon: IconEdit, label: 'Edit Client', urlEndPoint: `edit-client/${client ? client.ClientId : ''}` },
  ];

  const mainLinks = links.map((link, i) => (
    <Link to={`/${links[i].urlEndPoint}`} key={i}>
      <UnstyledButton key={i} className={classes.mainLink} onClick={() => clearLocalStorageSession()}>
        <div className={classes.mainLinkInner}>
          <link.icon size={30} className={classes.mainLinkIcon} stroke={1.5} color={'#2d862f'} />
          <span>{link.label}</span>
        </div>
      </UnstyledButton>
    </Link>
  ));

  return (
    <Navbar id='navbar' width={{ sm: 325 }} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.section}>
        <Link to={`/${client ? client.ClientId : ''}`}>
          <h2 id='topLeftText'>Plateau Bird Surveys</h2>
        </Link>
      </Navbar.Section>

      <SearchBar
        icon={<IconSearch size={20} stroke={1.5} />}
        styles={{ rightSection: { pointerEvents: 'none' } }}
        loggedIn={loggedIn}
      />

      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xl" weight={400} color="charcol">
            Add New Client
          </Text>
          <AddNewClient opened={opened} setOpened={setOpened} />
          <Group position="center">
            <ActionIcon variant="default" size={18} onClick={() => setOpened(true)}>
              <IconPlus size={12} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
}