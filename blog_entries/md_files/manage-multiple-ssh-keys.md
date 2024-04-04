GitHub allows developers to collaborate in teams on projects and maintain version control over our code. Like many others, I work at a company, but also develop my own projects on the side. This means I have a personal GitHub account, a GitHub account from the company, and recently, a third account from a client where I also contribute to the repository. Managing multiple SSH keys on one machine has always been a bit cumbersome, but in this tutorial, I'll explain how I seamlessly switch from one GitHub account to the next and be able to commit and push in different repositories.

## Solution
The solution is to define **host aliases** in the SSH config file (each alias for an account) and have seperate directories for each github account.

This is how:

1. [Generate SSH key pairs for accounts](https://help.github.com/articles/generating-a-new-ssh-key/) and [add them to GitHub accounts](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/).
2. Edit/Create SSH config file (`~/.ssh/config`):

  ```bash
  # Default GitHub account: personal
  Host github.com
      HostName github.com
      IdentityFile ~/.ssh/id_personal
      IdentitiesOnly yes
  
  # Work GitHub account: work
  Host github-work
      HostName github.com
      IdentityFile ~/.ssh/id_work
      IdentitiesOnly yes
  ```

  > NOTE: If you use any account frequently, you should use the default hostname (github.com).

3. [Add SSH private keys to your agent](https://help.github.com/articles/adding-a-new-ssh-key-to-the-ssh-agent/):

  ```bash
  ssh-add ~/.ssh/id_personal
  ssh-add ~/.ssh/id_work
  ```

## Test your connection:

```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
ssh -T git@github.com
ssh -T git@github-work
```

If everything is OK, you will see these messages:

```plaintext
Hi personal! You've successfully authenticated, but GitHub does not provide shell access.

Hi work! You've successfully authenticated, but GitHub does not provide shell access.
```

Now all are set, you need to remember:

```bash
git@github-work:org/project.git > user is work
git@github.com:org/project.git  > user is personal
```

If you need to clone a repository, just do:

```bash
git clone git@github-work:org1/project1.git /path/to/project1
cd /path/to/project1
git config user.email "email@example.com"
git config user.name  "FirstName LastName"
```

## Migrate repository
If you already have the repo set up, after the SSH config instructions, you need to change the URL of `origin`, just do:

```bash
cd /path/to/project2
git remote set-url origin git@github-work:org2/project2.git
git config user.email "email@example.com"
git config user.name  "FirstName LastName"
```

## Set up Git Configuration

to avoid the constant need to manually configure your git email and name like this:

```bash
git config user.email "email@example.com"
git config user.name  "FirstName LastName"
```

You can create mutilple Git Config files:

1. Edit your `~/.gitconfig` file

  ```bash
  [user]
    email = email@personal.com
    name = FirstName LastName
  [includeIf "gitdir:~/work_repositories/"]
      path = ~/work_repositories/.gitconfig
  ```
2. Create and edit a second Git Config file for your work account (`~/work_repositories/.gitconfig`): 
  ```bash
  [user]
    email = email@work.com
    name = FirstName LastName
  ```

Everytime you are in the `~/work_repositories/` directory, your work email will be used when you commit and push code.