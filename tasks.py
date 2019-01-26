from invoke import task

@task
def js_lint(c, fix=False):
    if fix:
        c.run("client/node_modules/.bin/eslint client/map.js --fix")
    else:
        c.run("client/node_modules/.bin/eslint client/map.js", pty=True)


@task
def lint(c):
    c.run("pycodestyle .")