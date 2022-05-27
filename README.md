# Documentation widget-xkr

Widget Javascript XHR is a library used to make a GET/POST request.

## Usage

So the basic setup looks something like this for perform parallel delete actions:

```

let requests = [],
    choosed = [1, 2, 3, '<moore id>'];

for (let x in choosed) {
    let xhr = new WXmlHttpRequest(),
        url = '/api/sso/oauth/delete'
            + String.fromCharCode(47)
            + encodeURIComponent(choosed[x])
            + String.fromCharCode(63)
            + 'timestamp'
            + String.fromCharCode(61)
            + Date.now();

    requests.push(xhr);

    xhr.setRequestUrl(url);
    xhr.setCallbackSuccess(function () {
        let parser = document.createElement('a');
        parser.href = this.getXHR().responseURL;

        let split = parser.pathname.split(String.fromCharCode(47)),
        key = split[split.length - 1] === 'delete'
            ? null
            : split[split.length - 1];

         // widgets.infinite.getBody().removeTR(key);
        choosed = choosed.filter(function (element) {
            return element != key;
        });
    });
}

for (let item = 0; item < requests.length; item++)
    requests[item].request();

delete requests;

```

## Structure

library:
- [window.WXmlHttpRequest](https://github.com/energia-source/widget-xhr/tree/main/lib)

<br>

## Contributing

Please read [CONTRIBUTING.md](https://github.com/energia-source/widget-xkr/blob/main/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting us pull requests.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/energia-source/widget-xkr/tags). 

## Authors

* **Paolo Fabris** - *Initial work* - [energia-europa.com](https://www.energia-europa.com/)
* **Gabriele Luigi Masero** - *Developer* - [energia-europa.com](https://www.energia-europa.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
