# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security bugs in FaceTrack AI seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@facetrack.ai**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information in your report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Preferred Languages

We prefer all communications to be in English.

### Policy

We follow the principle of [Coordinated Vulnerability Disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure).

## Security Features

FaceTrack AI implements the following security measures:

### Authentication & Authorization
- JWT-based authentication with 24-hour token expiry
- bcrypt password hashing with salt rounds
- Role-based access control (admin, manager, employee)
- Secure session management

### Data Protection
- Face embeddings encrypted at rest
- HTTPS/TLS encryption in transit
- SQL injection prevention with parameterized queries
- Input validation using Pydantic schemas

### Infrastructure Security
- Rate limiting (100 requests/minute per IP)
- CORS configuration for specific origins
- XSS protection headers
- Content Security Policy headers
- Docker container isolation
- Non-root container execution

### API Security
- Input validation on all endpoints
- Request size limits
- File upload validation
- Secure file storage

## Security Best Practices

When deploying FaceTrack AI, we recommend:

1. **Change default credentials** - Never use default passwords in production
2. **Use HTTPS** - Always enable TLS/SSL in production
3. **Rotate secrets** - Regularly rotate JWT secrets and API keys
4. **Monitor logs** - Set up log monitoring and alerting
5. **Backup data** - Regular database backups
6. **Update dependencies** - Keep all dependencies up to date
7. **Network security** - Use firewalls and network segmentation
8. **Access control** - Limit database access to application only

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed. We will:

1. Acknowledge receipt of the vulnerability report
2. Confirm the vulnerability and determine affected versions
3. Audit code to find similar vulnerabilities
4. Prepare fixes for all supported versions
5. Release security updates
6. Publicly disclose the vulnerability after patches are available

## Contact

If you have any questions about this security policy, please contact:

- Email: security@facetrack.ai
- GitHub Issues: For non-security related issues only

Thank you for helping keep FaceTrack AI secure!
