## High-level steps for a CloudFront S3 Origin Demo

1. CloudFront in AWS Console

- Navigate to the CloudFront service in the AWS Management Console.

2. Create Distribution

- Click on "Create Distribution" and choose "Web" as the delivery method.

3. Origin: S3 bucket that has public read permissions and static website hosting enabled.

- Ensure your S3 bucket's properties have "Static website hosting" enabled.
- Set the permissions to allow public read access.

4. Set alternate CNAME to the name you'll put in Route53

- In the "Distribution Settings", under "Alternate Domain Names (CNAMEs)", add the custom domain name (e.g., www.example.com).

5. Set default root document to index.html

- In the "Default Root Object" field, enter index.html.

6. Get an ACM certificate for the name you'll put in Route 53

- Navigate to the ACM service.
- Request a certificate for your domain (e.g., www.example.com).
- Validate the certificate using the DNS validation method.

7. Create and Deploy

- Review the settings and create the distribution.
- Note the distribution ID and domain name provided by CloudFront.

8. Create an Alias entry in your Route 53 zone pointing to the CloudFront distribution ID

- In Route 53, create a new record set.
- Select "Alias" and choose the CloudFront distribution as the target.

9. Browse to the website via FQDN in Route53

- Open a browser and navigate to your custom domain (e.g., www.example.com).

10. Modify a file in the S3 bucket.

- Upload a new version of a file (e.g., index.html) to the S3 bucket.

11. Run an invalidation on the CloudFront distribution.

- In the CloudFront console, select your distribution.
- Create an invalidation and specify the path of the file you modified (e.g., /index.html).

12. Refresh the browser.

- Refresh your website to see the updated content.

### Additional Tips

- **TTL Settings**: Adjust the TTL (Time to Live) settings in CloudFront to control how long content is cached.
- **Monitoring and Logging**: Enable CloudFront logging to monitor requests and performance.
- **Security**: Consider using IAM roles and policies to manage permissions securely.

These steps provide a clear and comprehensive guide to setting up a CloudFront distribution with an S3 origin and a custom domain managed by Route 53.
