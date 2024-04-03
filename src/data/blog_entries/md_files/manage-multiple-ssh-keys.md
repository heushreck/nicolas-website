Use SSH keys and define host aliases in the SSH config file (each alias for an account).

**How to?**

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

4. Test your connection:

  ```bash
  ssh-keyscan github.com &gt;&gt; ~/.ssh/known_hosts
  ssh -T git@github.com
  ssh -T git@github-work
  ```

  If everything is OK, you will see these messages:

  ```plaintext
  Hi personal! You've successfully authenticated, but GitHub does not provide shell access.

  Hi work! You've successfully authenticated, but GitHub does not provide shell access.
  ```

5. Now all are set, you need to remember:

  ```bash
  git@github-work:org/project.git =&gt; user is work
  git@github.com:org/project.git  =&gt; user is personal
  ```

- If you need to clone a repository, just do:

  ```bash
  git clone git@github-work:org1/project1.git /path/to/project1
  cd /path/to/project1
  git config user.email "email@example.com"
  git config user.name  "FirstName LastName"
  ```

- If you already have the repo set up, after the SSH config instructions, you need to change the URL of `origin`, just do:

  ```bash
  cd /path/to/project2
  git remote set-url origin git@github-work:org2/project2.git
  git config user.email "email@example.com"
  git config user.name  "FirstName LastName"
  ```

- If you are creating a new repository on local:

  ```bash
  cd /path/to/project3
  git init
  git remote add origin git@github-work:org3/project3.git
  git config user.email "superman@example.com"
  git config user.name  "Super Man"
  git add .
  git commit -m "Initial commit"
  git push -u origin master
  ```
