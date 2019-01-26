from invoke import task

@task
def js_lint(c):
    c.run("client/node_modules/.bin/eslint client/map.js", pty=True)


@task
def lint(c):
    c.run("pycodestyle .")